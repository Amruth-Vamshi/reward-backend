import gql from "graphql-tag";
import { ACCESS_TYPES, FILE_SYSTEM_TYPES } from "../common/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
} from "../common/permissions";

const typeDefs = gql`

  enum STATUS

  enum FILE_SYSTEM_TYPE {
    ${[...Object.values(FILE_SYSTEM_TYPES)]}
  }

  enum ACCESS_TYPE {
    ${[...Object.values(ACCESS_TYPES)]}
  }

  scalar JSON
  type Organization
  scalar Upload
  type PaginationInfo
  input SortOptions
  input PageOptions


  type FileSystemsPage{
    data : [FileSystem!]
    paginationInfo: PaginationInfo
  }

  type FilesPage {
    data: [File!]
    paginationInfo: PaginationInfo
  }

  type Query {

    fileSystem(id : ID!, organizationId: ID): FileSystem @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE_SYSTEM
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    fileSystems(name: String, accessType: String, fileSystemType: String, status: String, organizationId: ID!,  pageOptions: PageOptions = {} , sortOptions: SortOptions = {}): FileSystemsPage @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE_SYSTEM
    },permission:${POLICY_PERMISSION_ENTITY.LIST}}])

    file(id: ID!, organizationId: ID): File @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    files(fileSystemId: ID, name: String, status: String, organizationId: ID!,  pageOptions: PageOptions = {} , sortOptions: SortOptions = {}): FilesPage @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE
    },permission:${POLICY_PERMISSION_ENTITY.LIST}}])

  }

  type Mutation {

    createFileSystem(input: CreateFileSystemInput!): FileSystem @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE_SYSTEM
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
    updateFileSystem(input: UpdateFileSystemInput!): FileSystem @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE_SYSTEM
    },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])
    deleteFileSystem(id:ID!, organizationId: ID): Boolean @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE_SYSTEM
    },permission:${POLICY_PERMISSION_ENTITY.DELETE}}])

    generateSignedUploadURL(input: SignedUploadURLInput!): SignedURL @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
    uploadFile(input: FileUploadInput!): File @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
    updateFile(file: Upload!, input: UpdateUploadFileInput!): File @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE
    },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])
    deleteFile(id: ID!, organizationId: ID): Boolean @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.FILE
    },permission:${POLICY_PERMISSION_ENTITY.DELETE}}])

  }

  input CreateFileSystemInput {
    name: String!
    description: String!
    accessType: ACCESS_TYPE!
    fileSystemType: FILE_SYSTEM_TYPE!
    configuration: JSON!
    enabled: Boolean!    
    organizationId: ID!

  }

  input UpdateFileSystemInput {
    id: ID!
    name: String
    description: String
    accessType: ACCESS_TYPE
    fileSystemType: FILE_SYSTEM_TYPE
    configuration: JSON
    enabled: Boolean
    organizationId: ID!
  }

  type FileSystem {

    id: ID
    name: String
    description: String
    accessType: ACCESS_TYPE
    fileSystemType: FILE_SYSTEM_TYPE
    enabled: Boolean
    status: STATUS
    organization: Organization
  }

  input FileUploadInput {
    file: Upload!
    description:String
    fileSystemId: String
    organizationId: String
  }

  input UpdateUploadFileInput {
    id: ID!
    name: String
    description:String
    fileSystemId: String
    organizationId: String!

  }

  type File {
    id: ID
    name: String
    mimeType: String
    encoding: String
    description: String
    internalUrl: String
    publicUrl: String
    status: STATUS
    organization: Organization
    fileSystem: FileSystem
  }

  input SignedUploadURLInput {
    name: String!
    description: String
    status: STATUS
    organizationId: String!
    fileSystemId: String!
  }
  
  type S3Response{
    url: String
    expiry: String
  }

  type SignedURL{
    s3Response: S3Response
    cloudinaryResponse: JSON
  }

  `;

export default typeDefs;
