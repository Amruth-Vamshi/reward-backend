import { getConnection } from "typeorm";
// import { optionResolver } from "./option.resolver";
import { WalkinPlatformError } from "../../common/exceptions/walkin-platform-error";
import { CategoryProvider } from "../category/category.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import {
  OptionProvider,
  OptionValueProvider
} from "../option/option.providers";
import {
  ProductCategoryProvider,
  CategoryProductOptionProvider,
  ProductProvider,
  ProductVariantProvider,
  ProductVariantValueProvider
} from "./product.providers";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { Injector } from "@graphql-modules/di";
import { ProductRelationshipProvider } from "../productRelationship/productRelationship.providers";
import { Product } from "../../../entity";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { ProductTagProvider } from "../productTag/productTag.providers";
import { PRODUCT_TYPE } from "../../common/constants";
import { productVariantsValueLoader } from "./product.loader";

const resolvers = {
  Query: {
    productByProductCode: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(ProductProvider)
          .getProductByProductCode(transactionManager, input);
      });
    },

    products: ({ user, application },  {input={}}:any , { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(ProductProvider)
          .getProducts(transactionManager, input);
      });
    },

    productOptionsByProductId: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(args, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(CategoryProductOptionProvider)
          .getCategoryProductOptionsByProductId(
            transactionManager,
            input.productId,
            input.organizationId
          );
      });
    },
    productVariantsByProductId: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(args, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(ProductVariantProvider)
          .getProductVariantsByProductId(
            transactionManager,
            input.productId,
            input.organizationId
          );
      });
    },
    productVariantValuesByProductVariantId: (
      { user, application },
      args,
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(args, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(ProductVariantValueProvider)
          .getProductVariantValuesByProductVariantId(
            transactionManager,
            args.productVariantId
          );
      });
    },
    productCategoriesByCategoryId: (
      { user, application },
      args,
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(args, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const productCategories = await injector
          .get(ProductCategoryProvider)
          .findProductCategoryByCategoryId(
            transactionManager,
            input.categoryId,
            input.organizationId
          );

        let uniqueProductIds = {};
        let productCategoriesArray = [];
        if (productCategories) {
          productCategoriesArray = productCategories.filter(
            productCategory =>
              !uniqueProductIds[productCategory.product.id] &&
              (uniqueProductIds[productCategory.product.id] = true)
          );
        }
        return productCategoriesArray;
      });
    },
    productCategoriesByCategoryCode: async (
      { user, application },
      args,
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(args, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(ProductCategoryProvider)
          .findProductCategoryByCategoryCode(
            transactionManager,
            input.categoryCode,
            input.organizationId
          );
      });
    },
    productByExternalProductId: async (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(ProductProvider)
          .getProductByExternalProductId(transactionManager, input);
      });
    }
  },
  Mutation: {
    createProduct: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(ProductProvider)
          .createProduct(transactionManager, input);
      });
    },
    updateProduct: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {        
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(ProductProvider)
          .updateProduct(transactionManager, input);
      });
    },
    updateProductCategorySortSeq: async (
      { user, application }: IAuthResolverArgs,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );
        input = setOrganizationToInput(input, user, application);

        return injector
          .get(ProductProvider)
          .updateProductCategorySortSeq(transactionManager, input);
      });
    },
    disableProduct: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(ProductProvider)
          .disableProduct(transactionManager, args.productName,input.organizationId);
      });
    },
    createCategoryProductOption: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(CategoryProductOptionProvider)
          .createCategoryProductOption(transactionManager, input);
      });
    },
    updateCategoryProductOption: (
      { user, application },
      args,
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(CategoryProductOptionProvider)
          .updateCategoryProductOption(transactionManager, args.input);
      });
    },
    createProductVariant: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(ProductVariantProvider)
          .createProductVariant(transactionManager, args.input);
      });
    },
    updateProductVariant: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        const product = await injector
          .get(ProductProvider)
          .getProductById(
            transactionManager,
            args.input.productId,
            input.organizationId
          );
        if (product) {
          return injector
            .get(ProductVariantProvider)
            .updateProductVariant(transactionManager, args.input);
        } else {
          throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
        }
      });
    },
    createProductVariantValue: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);

        return injector
          .get(ProductVariantValueProvider)
          .createProductVariantValue(transactionManager, args.input);
      });
    },
    updateProductVariantValue: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(ProductVariantValueProvider)
          .updateProductVariantValue(transactionManager, args.input);
      });
    },
    createProductCategory: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(ProductCategoryProvider)
          .createProductCategory(transactionManager, input);
      });
    },
    updateProductCategory: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(ProductCategoryProvider)
          .updateProductCategory(transactionManager, input);
      });
    },
    removeProductCategory: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organization
        );

        return injector
          .get(ProductCategoryProvider)
          .removeProductCategory(transactionManager, args.input);
      });
    }
  },
  Product: {
    // variants: (product, args, { productVariantsLoader }) => {
    //   return productVariantsLoader.load(product);
    // },
    // productRelationShip: async (
    //   product,
    //   args,
    //   { productRelationshipLoader }
    // ) => {
    //   return productRelationshipLoader.load(product);
    // },
    // options: async (product, args, { injector }: { injector: Injector }) => {
    //   return getConnection().transaction(async transactionEntityManager => {
    //     const { id, productType } = product;
    //     var options = [];
    //     if (productType == PRODUCT_TYPE.VARIANT) {
    //       options = await injector
    //         .get(OptionProvider)
    //         .optionValueByProductId(transactionEntityManager, id);
    //     } else {
    //       options = await injector
    //         .get(OptionProvider)
    //         .getOptionsByProductId(transactionEntityManager, id);
    //     }
    //     return options;
    //   });
    // },
    // productPrices: async (product, args, { productValuesLoader }) => {
    //   return productValuesLoader.load(product);
    // },
    // categories: async (product, args, { productCategoryLoader }) => {
    //   return productCategoryLoader.load(product);
    // },
    // tags: async (product, args, { productTagsLoader }) => {
    //   return productTagsLoader.load(product);
    // },
    // menuTimings: async (product, _, context) => {
    //   // set organizationId as part of category as it is needed to fetch menu timings in data loader
    //   product["organizationId"] = context.organizationId;
    //   // injector is needed to access the menutimings provider functions
    //   product["injector"] = context.injector;
    //   return context.productMenuTimingLoader.load(product);
    // }
  },
  CategoryProductOption: {
    option: (productOption, args, context) => {
      productOption["organizationId"] = context.organizationId;
      return context.optionsLoader.load(productOption);
    },
    product: (productOption, args, { productLoader }) => {
      if (productOption && productOption.productId) {
        return productLoader.load(productOption.productId);
      }
    }
  },
  ProductVariant: {
    product: (parent, args, { productLoader }) => {
      if (parent && parent.productId) {
        return productLoader.load(parent.productId);
      }
    },
    optionValues: async (parent, args, { productVariantsValueLoader }) => {
      return productVariantsValueLoader.load(parent);
    }
  },
  ProductVariantValue: {
    productVariant: (parent, args, context) => {
      return context.productVariantsByVariantsId.load(parent);
    },
    optionValue: (parent, args, context) => {
      if (parent && parent.optionValueId) {
        return context.optionValuesByIdLoader.load(parent.optionValueId);
      }
    }
  },
  ProductCategory: {
    product: (parent, args, { productLoader }) => {
      if (parent && parent.productId) {
        return productLoader.load(parent.productId);
      }
    },
    category: (parent, args, { categoryDetailsLoader }) => {
      if (parent && parent.categoryId) {
        return categoryDetailsLoader.load(parent.categoryId);
      }
    }
  },
  OptionValue: {
    option: (optionValue, _, context) => {
      // if option is already present in optionValue return option else query from database.
      if (optionValue.option) {
        return optionValue.option;
      }
      optionValue["organizationId"] = context.organizationId;
      return context.optionsLoader.load(optionValue);
    }
  },
  Option: {
    optionValues: (option, _, context) => {
      return context.optionValuesLoader.load(option);
    }
  },
  ProductRelationshipCustom: {
    child: async (parent, args, context) => {
      if (parent) {
        return getConnection().transaction(async transactionManager => {
          const childProduct = await context.injector
            .get(ProductProvider)
            .getProductById(
              transactionManager,
              parent.childId,
              context.organizationId
            );
          if (childProduct && parent.product.store) {
            childProduct.store = parent.product.store;
          }
          return childProduct;
        });
      }
    },
    parent: async (parent, args, context) => {
      if (parent) {
        return getConnection().transaction(async transactionManager => {
          const parentProduct = await context.injector
            .get(ProductProvider)
            .getProductById(
              transactionManager,
              parent.parentId,
              context.organizationId
            );
          if (parentProduct && parent.product.store) {
            parentProduct.store = parent.product.store;
          }
          return parentProduct;
        });
      }
    }
  }
};

export default [resolvers];
