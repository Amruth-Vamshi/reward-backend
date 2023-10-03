import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";

import { FileSystemProvider, FileProvider } from "./filesystem.providers";
import {
  findOrganizationOrThrowError,
  findFileSystemOrThrowError,
  checkUserPartOfInputOrganizationElseThrowError,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../common/utils/utils";
import {
  uploadToS3,
  uploadToCloudinary
} from "../common/utils/fileUploadUtils";
import { FileSystem } from "../../entity";
import { FILE_SYSTEM_TYPES } from "../common/constants";
import { WalkinPlatformError } from "../common/exceptions/walkin-platform-error";
import { STATUS } from "../common/constants/constants";
import { resultKeyNameFromField } from "apollo-utilities";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";

const BUCKET_NAME = "ccd-test-job-upload";

export default {
  Query: {
    fileSystem: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );

      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(FileSystemProvider)
          .getFileSystem(transactionalEntityManager, args.id, organizationId);
      });
    },
    fileSystems: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(FileSystemProvider)
          .getFileSystems(
            transactionalEntityManager,
            args.pageOptions,
            args.sortOptions,
            args.name,
            args.accessType,
            args.fileSystemType,
            args.status,
            organizationId
          );
      });
    },

    file: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );

      let result = await getManager().transaction(
        transactionalEntityManager => {
          return injector
            .get(FileProvider)
            .getFile(transactionalEntityManager, args.id, organizationId);
        }
      );

      return result;
    },

    files: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(FileProvider)
          .getFiles(
            transactionalEntityManager,
            args.pageOptions,
            args.sortOptions,
            args.fileSystemId,
            args.name,
            args.status,
            organizationId
          );
      });
    }
  },

  Mutation: {
    createFileSystem: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      let organization = await findOrganizationOrThrowError(organizationId);
      return getManager().transaction(transactionalEntityManager => {
        let input = args.input;
        input.status = STATUS.ACTIVE;
        return injector
          .get(FileSystemProvider)
          .createFileSystem(transactionalEntityManager, {
            ...input,
            organization
          });
      });
    },
    updateFileSystem: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      let organization = await findOrganizationOrThrowError(organizationId);
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(FileSystemProvider)
          .updateFileSystem(transactionalEntityManager, {
            ...args.input,
            organization
          });
      });
    },
    deleteFileSystem: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );

      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(FileSystemProvider)
          .deleteFileSystem(
            transactionalEntityManager,
            args.id,
            organizationId
          );
      });
    },
    generateSignedUploadURL: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validations for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.input.organizationId
      );
      let organization = await findOrganizationOrThrowError(organizationId);

      return getManager().transaction(async transactionalEntityManager => {
        let fileSystem = await injector
          .get(FileSystemProvider)
          .getFileSystem(
            transactionalEntityManager,
            args.input.fileSystemId,
            organizationId
          );

        if (!fileSystem) {
          throw new WCoreError(WCORE_ERRORS.FILE_NOT_FOUND);
        }

        return injector.get(FileProvider).generateSignedUploadURL(
          transactionalEntityManager,
          {
            ...args.input,
            organization,
            fileSystem
          },
          fileSystem
        );
      });
    },

    uploadFile: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validations for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );

      let organization = await findOrganizationOrThrowError(organizationId);

      return getManager().transaction(async transactionalEntityManager => {
        // validations for file system id
        let fileSystem = await injector
          .get(FileSystemProvider)
          .getFileSystem(
            transactionalEntityManager,
            args.input.fileSystemId,
            organizationId
          );

        if (!fileSystem) {
          throw new WCoreError(WCORE_ERRORS.FILE_NOT_FOUND);
        }
        const { filename, mimetype, encoding } = await args.input.file;
        let publicUrl = "";
        let internalUrl = "";
        let fileSystemType = fileSystem.fileSystemType;
        let accessType = fileSystem.accessType;

        switch (fileSystemType) {
          case FILE_SYSTEM_TYPES.S3:
            let uploadResponse: any = await uploadToS3(
              filename,
              args.input.file,
              accessType,
              fileSystem.configuration
            );
            internalUrl = uploadResponse.Location;
            if (uploadResponse.signedUrl) {
              publicUrl = uploadResponse.signedUrl;
            }
            break;
          case FILE_SYSTEM_TYPES.CLOUDINARY:
            let cloudinaryResponse: any = await uploadToCloudinary(
              filename,
              args.input.file,
              fileSystem.configuration
            );
            if (cloudinaryResponse) {
              internalUrl = cloudinaryResponse.url;
              publicUrl = cloudinaryResponse.secure_url;
            }
            break;
          default:
            console.log("File system type not supported");
        }
        let input = {
          name: filename,
          description: args.input.description,
          mimeType: mimetype,
          encoding: encoding,
          internalUrl: internalUrl,
          publicUrl: publicUrl,
          status: STATUS.ACTIVE,
          organization: organization,
          fileSystem: fileSystem
        };
        return injector
          .get(FileProvider)
          .createFile(transactionalEntityManager, input);
      });
    },
    updateFile: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validations for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      let organization = await findOrganizationOrThrowError(organizationId);
      // validations for file system id
      return getManager().transaction(async transactionalEntityManager => {
        let fileSystem = await injector
          .get(FileSystemProvider)
          .getFileSystem(
            transactionalEntityManager,
            args.input.fileSystemId,
            organizationId
          );

        if (!fileSystem) {
          throw new WCoreError(WCORE_ERRORS.FILE_NOT_FOUND);
        }

        return injector
          .get(FileProvider)
          .updateFile(transactionalEntityManager, {
            ...args.input,
            organization,
            fileSystem
          });
      });
    },

    deleteFile: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        return injector
          .get(FileProvider)
          .deleteFile(transactionalEntityManager, args.id, organizationId);
      });
    }
  }
};
