import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import { FileSystem, File } from "../../entity";
import {
  updateEntity,
  checkUserPartOfInputOrganizationElseThrowError
} from "../common/utils/utils";
import {
  STATUS,
  FILE_SYSTEM_TYPES,
  CACHING_KEYS,
  EXPIRY_MODE,
  CACHE_TTL
} from "../common/constants";
import {
  presignedUrlS3,
  preSignedUrlToCloudinary
} from "../common/utils/fileUploadUtils";
import { addPaginateInfo } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { PageOptions } from "@walkinserver/walkin-core/src/modules/common/constants";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../common/utils/redisUtils";
import { isEmpty } from "lodash";
@Injectable()
export class FileSystemProvider {
  /*
   * Gives the file system from database
   */

  public async getFileSystem(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<FileSystem> {
    const key = `${CACHING_KEYS.FILE_SYSTEM}_${id}_${organizationId}`;
    let fileSystem: any = await getValueFromCache(key);
    if (isEmpty(fileSystem) || fileSystem == null) {
      fileSystem = await transactionalEntityManager.findOne(FileSystem, {
        where: {
          id,
          organization: organizationId
        },
        relations: ["organization"]
      });
      if (fileSystem) {
        await setValueToCache(key, fileSystem, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    return fileSystem;
  }

  @addPaginateInfo
  public async getFileSystems(
    transactionalEntityManager: EntityManager,
    pageOptions: PageOptions,
    sortOptions,
    name: string,
    accessType: string,
    fileSystemType: string,
    status: string,
    organizationId: string
  ): Promise<any> {
    const where: any = {};
    if (name) {
      where.name = name;
    }
    if (accessType) {
      where.accessType = accessType;
    }
    if (fileSystemType) {
      where.fileSystemType = fileSystemType;
    }
    if (status) {
      where.status = status;
    }
    if (organizationId) {
      where.organization = organizationId;
    }
    const options: any = {};
    options.where = where;
    options.relations = ["organization"];
    options.order = {
      [sortOptions.sortBy]: sortOptions.sortOrder
    };
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    return transactionalEntityManager.findAndCount(FileSystem, options);
  }

  public async createFileSystem(
    transactionalEntityManager: EntityManager,
    input: any
  ): Promise<FileSystem> {
    const fileSystemData = {
      name: input.name,
      description: input.description,
      accessType: input.accessType,
      configuration: input.configuration,
      fileSystemType: input.fileSystemType,
      enabled: input.enabled,
      status: input.status,
      organization: input.organization
    };
    let fileSystemEntity = transactionalEntityManager.create(
      FileSystem,
      fileSystemData
    );
    fileSystemEntity = await transactionalEntityManager.save(fileSystemEntity);

    return this.getFileSystem(
      transactionalEntityManager,
      fileSystemEntity.id,
      input.organization.id
    );
  }

  public async updateFileSystem(
    transactionalEntityManager: EntityManager,
    input: any
  ): Promise<FileSystem> {
    const fileSystemToUpdate = await transactionalEntityManager.findOneOrFail(
      FileSystem,
      {
        where: {
          id: input.id
        }
      }
    );
    updateEntity(fileSystemToUpdate, input);
    const updatedFileSystem = await transactionalEntityManager.save(
      fileSystemToUpdate
    );
    const keys = [
      `${CACHING_KEYS.FILE_SYSTEM}_${input.id}_${input.organizationId}`
    ];
    removeValueFromCache(keys);
    return updatedFileSystem;
  }

  public async deleteFileSystem(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ) {
    let fileSystemToUpdate;
    try {
      fileSystemToUpdate = await transactionalEntityManager.findOneOrFail(
        FileSystem,
        {
          where: {
            id: id,
            organization: organizationId
          },
          relations: ["organization"]
        }
      );
    } catch (EntityNotFound) {
      throw new WCoreError(WCORE_ERRORS.FILE_SYSTEM_NOT_FOUND);
    }

    const keys = [`${CACHING_KEYS.FILE_SYSTEM}_${id}_${organizationId}`];
    removeValueFromCache(keys);

    if (fileSystemToUpdate) {
      if (fileSystemToUpdate.status === STATUS.ACTIVE) {
        fileSystemToUpdate.status = STATUS.INACTIVE;
        await transactionalEntityManager.save(fileSystemToUpdate);
        return true;
      }
    }
    return false;
  }
}

@Injectable()
export class FileProvider {
  public async getFile(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<File> {
    return transactionalEntityManager.findOne(File, {
      where: {
        id,
        organization: organizationId
      },
      relations: ["organization", "fileSystem"]
    });
  }

  @addPaginateInfo
  public async getFiles(
    transactionalEntityManager: EntityManager,
    pageOptions: PageOptions,
    sortOptions,
    fileSystemId: string,
    name: string,
    status: string,
    organizationId: String
  ): Promise<any> {
    const options: any = {};
    const where: any = {};
    if (fileSystemId) {
      where.fileSystem = fileSystemId;
    }
    if (name) {
      where.name = name;
    }
    if (status) {
      where.status = status;
    }
    if (organizationId) {
      where.organizationId = organizationId;
    }

    options.where = where;
    options.relations = ["organization", "fileSystem"];
    options.order = {
      [sortOptions.sortBy]: sortOptions.sortOrder
    };
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    return transactionalEntityManager.findAndCount(File, options);
  }

  public async createFile(
    transactionalEntityManager: EntityManager,
    input: any
  ): Promise<File> {
    let fileEntity = transactionalEntityManager.create(File, input);
    fileEntity = await transactionalEntityManager.save(fileEntity);

    return this.getFile(
      transactionalEntityManager,
      fileEntity.id,
      input.organization.id
    );
  }

  public async updateFile(
    transactionalEntityManager: EntityManager,
    input: any
  ): Promise<File> {
    const fileToUpdate = await transactionalEntityManager.findOneOrFail(File, {
      where: {
        id: input.id
      }
    });
    updateEntity(fileToUpdate, input);
    return transactionalEntityManager.save(fileToUpdate);
  }

  public async deleteFile(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ) {
    let fileToUpdate;
    try {
      fileToUpdate = await transactionalEntityManager.findOneOrFail(File, {
        where: {
          id: id,
          organization: organizationId
        },
        relations: ["organization"]
      });
    } catch (EntityNotFound) {
      throw new WCoreError(WCORE_ERRORS.FILE_NOT_FOUND);
    }

    if (fileToUpdate) {
      if (fileToUpdate.status === STATUS.ACTIVE) {
        fileToUpdate.status = STATUS.INACTIVE;
        await transactionalEntityManager.save(fileToUpdate);
        return true;
      }
    }
    return false;
  }

  public async generateSignedUploadURL(
    transactionalEntityManager: EntityManager,
    input: any,
    fileSystem: any
  ) {
    let result: any = {};
    let publicUrl = "";
    if (fileSystem.fileSystemType === FILE_SYSTEM_TYPES.S3) {
      let s3Response = await presignedUrlS3(
        input.name,
        fileSystem.configuration
      );
      result.s3Response = s3Response;
      publicUrl = s3Response.url;
    } else if (fileSystem.fileSystemType === FILE_SYSTEM_TYPES.CLOUDINARY) {
      let requestOptions: any = {};
      if (fileSystem.configuration && fileSystem.configuration.requestOptions) {
        requestOptions = fileSystem.configuration.requestOptions;
      }
      let cloudinaryResponse = await preSignedUrlToCloudinary(
        input.name,
        fileSystem.configuration,
        requestOptions
      );
      result.cloudinaryResponse = cloudinaryResponse;
    }

    let extendedInput = {
      ...input,
      mimeType: "default/default",
      encoding: "default",
      internalUrl: "",
      publicUrl: publicUrl
    };
    let fileEntity = transactionalEntityManager.create(File, extendedInput);
    fileEntity = await transactionalEntityManager.save(fileEntity);

    return result;
  }
}
