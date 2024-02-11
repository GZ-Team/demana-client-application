export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AnonymousLoginForm = {
  venueId: Scalars['ID']['input'];
};

export type AuthenticationFeedback = {
  __typename?: 'AuthenticationFeedback';
  message?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<SecurityToken>;
  success?: Maybe<Scalars['Boolean']['output']>;
  token?: Maybe<SecurityToken>;
};

export type CategoryFilter = {
  subcategories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ChangePasswordForm = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type CountryOptionDto = {
  __typename?: 'CountryOptionDto';
  countryCode?: Maybe<Scalars['String']['output']>;
  countryName?: Maybe<Scalars['String']['output']>;
  telephonePrefix?: Maybe<Scalars['String']['output']>;
};

export type CustomerInvoiceDto = {
  __typename?: 'CustomerInvoiceDto';
  dueDate?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lines?: Maybe<Array<Maybe<CustomerInvoiceLineDto>>>;
  number?: Maybe<Scalars['String']['output']>;
  periodEnd?: Maybe<Scalars['String']['output']>;
  periodStart?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  stripePdfInvoiceUrl?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
};

export type CustomerInvoiceLineDto = {
  __typename?: 'CustomerInvoiceLineDto';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  periodEnd?: Maybe<Scalars['String']['output']>;
  periodStart?: Maybe<Scalars['String']['output']>;
};

export type Feedback = {
  __typename?: 'Feedback';
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ForgotPasswordForm = {
  email: Scalars['String']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  timeStamp: Scalars['String']['input'];
  verification: Scalars['String']['input'];
};

export type FuturePayoutDetailsDto = {
  __typename?: 'FuturePayoutDetailsDto';
  amount?: Maybe<Scalars['Float']['output']>;
  creationDate?: Maybe<Scalars['String']['output']>;
  estimatedPayoutDate?: Maybe<Scalars['String']['output']>;
};

export type GlobalOption = {
  __typename?: 'GlobalOption';
  index?: Maybe<Scalars['Int']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type GlobalOptionList = {
  __typename?: 'GlobalOptionList';
  countryOptions?: Maybe<Array<Maybe<CountryOptionDto>>>;
  languageOptions?: Maybe<Array<Maybe<LanguageDto>>>;
  orderEntryTypes?: Maybe<Array<Maybe<OrderEntryTypeDto>>>;
  orderStatuses?: Maybe<Array<Maybe<GlobalOption>>>;
  paymentMethodOptions?: Maybe<Array<Maybe<PaymentMethodOptionDto>>>;
  venueSubscriptionModules?: Maybe<Array<Maybe<VenueSubscriptionDetailDto>>>;
  venueSubscriptionPlans?: Maybe<Array<Maybe<VenueSubscriptionDetailDto>>>;
};

export type LanguageDto = {
  __typename?: 'LanguageDto';
  code?: Maybe<Scalars['String']['output']>;
  isApplicationLanguage?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type LoginForm = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  verification: Scalars['String']['input'];
};

export type MenuCategoriesIndexForm = {
  categories?: InputMaybe<Array<InputMaybe<MenuCategoryIndexForm>>>;
  venueId: Scalars['ID']['input'];
};

export type MenuCategoryDto = {
  __typename?: 'MenuCategoryDto';
  available?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subcategories?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  translations?: Maybe<Array<Maybe<TranslationDto>>>;
  venueId: Scalars['ID']['output'];
};

export type MenuCategoryForm = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  menuId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  subcategories?: InputMaybe<Array<InputMaybe<MenuSubcategoryForm>>>;
};

export type MenuCategoryIndexForm = {
  categoryId: Scalars['ID']['input'];
  index: Scalars['Int']['input'];
};

export type MenuDto = {
  __typename?: 'MenuDto';
  categories?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id: Scalars['ID']['output'];
};

export type MenuSectionTranslationForm = {
  entityId: Scalars['ID']['input'];
  localeCode: Scalars['String']['input'];
  sectionKey: MenuTranslationSectionKey;
  translations: Array<InputMaybe<MenuTranslationItem>>;
  venueId: Scalars['ID']['input'];
};

export type MenuSubcategoryDto = {
  __typename?: 'MenuSubcategoryDto';
  available?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  menuCategory: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  translations?: Maybe<Array<Maybe<TranslationDto>>>;
  venueId: Scalars['ID']['output'];
};

export type MenuSubcategoryForm = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  menuCategory?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['String']['input'];
};

export type MenuTranslationItem = {
  key: MenuTranslationItemKey;
  translation: Scalars['String']['input'];
};

export enum MenuTranslationItemKey {
  Description = 'DESCRIPTION',
  Name = 'NAME'
}

export enum MenuTranslationSectionKey {
  Categories = 'CATEGORIES',
  Information = 'INFORMATION',
  Products = 'PRODUCTS',
  Properties = 'PROPERTIES',
  Subcategories = 'SUBCATEGORIES'
}

export type Mutation = {
  __typename?: 'Mutation';
  anonymousLogin?: Maybe<AuthenticationFeedback>;
  archiveOrder?: Maybe<OrderDto>;
  cancelVenueSubscription?: Maybe<Feedback>;
  changePassword?: Maybe<Feedback>;
  changeVenueSubscriptionStatus?: Maybe<Feedback>;
  deleteMenuCategoriesByIds?: Maybe<Array<Maybe<MenuCategoryDto>>>;
  deleteMenuSubcategoriesByIds?: Maybe<Array<Maybe<MenuSubcategoryDto>>>;
  deleteOrder?: Maybe<Feedback>;
  deleteProductPropertiesByIds?: Maybe<Array<Maybe<ProductPropertyDto>>>;
  deleteProductsByIds?: Maybe<Array<Maybe<ProductDto>>>;
  deleteQrCodesByIds?: Maybe<Array<Maybe<TableDto>>>;
  handleRegistrantConfirmation?: Maybe<Feedback>;
  login?: Maybe<AuthenticationFeedback>;
  printOrder?: Maybe<Feedback>;
  refresh?: Maybe<AuthenticationFeedback>;
  register?: Maybe<Feedback>;
  registerDesktopApplication?: Maybe<Scalars['String']['output']>;
  registerNotificationSubscription?: Maybe<WebPushNotificationSubscriptionDto>;
  registerPaymentModuleConsent?: Maybe<Feedback>;
  resendRegistrantConfirmation?: Maybe<Feedback>;
  resetPassword?: Maybe<Feedback>;
  saveMenuCategoriesIndex?: Maybe<Array<Maybe<MenuCategoryDto>>>;
  saveMenuCategory?: Maybe<MenuCategoryDto>;
  saveMenuSectionTranslation?: Maybe<Feedback>;
  saveMenuSubcategory?: Maybe<MenuSubcategoryDto>;
  saveProduct?: Maybe<ProductDto>;
  saveProductProperty?: Maybe<ProductPropertyDto>;
  saveQrCode?: Maybe<TableDto>;
  saveUserPreferences?: Maybe<UserPreferencesDto>;
  saveVenue?: Maybe<VenueDto>;
  saveVenueConfiguration?: Maybe<VenueDto>;
  saveVenueScheduleConfiguration?: Maybe<VenueDto>;
  saveVenueSubscription?: Maybe<VenueSubscriptionDto>;
  saveVenueTranslationConfiguration?: Maybe<VenueDto>;
  sendForgotPasswordRequest?: Maybe<Feedback>;
  setupPaymentMethod?: Maybe<Feedback>;
  updateAvailabilityMenuCategories?: Maybe<Array<Maybe<MenuCategoryDto>>>;
  updateAvailabilityMenuSubcategories?: Maybe<Array<Maybe<MenuSubcategoryDto>>>;
  updateAvailabilityProductProperties?: Maybe<Array<Maybe<ProductPropertyDto>>>;
  updateAvailabilityProducts?: Maybe<Array<Maybe<ProductDto>>>;
  updateAvailabilityQrCodes?: Maybe<Array<Maybe<TableDto>>>;
};


export type MutationAnonymousLoginArgs = {
  anonymousLoginForm: AnonymousLoginForm;
};


export type MutationArchiveOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationCancelVenueSubscriptionArgs = {
  userFeedbackForm?: InputMaybe<UserFeedbackForm>;
};


export type MutationChangePasswordArgs = {
  changePasswordForm: ChangePasswordForm;
};


export type MutationChangeVenueSubscriptionStatusArgs = {
  status?: InputMaybe<PriceStatus>;
};


export type MutationDeleteMenuCategoriesByIdsArgs = {
  filter?: InputMaybe<CategoryFilter>;
  menuCategoryIds: Array<InputMaybe<Scalars['ID']['input']>>;
  menuId: Scalars['ID']['input'];
};


export type MutationDeleteMenuSubcategoriesByIdsArgs = {
  filter?: InputMaybe<SubcategoryFilter>;
  menuCategoryIds: Array<InputMaybe<Scalars['ID']['input']>>;
  menuSubcategoryIds: Array<InputMaybe<Scalars['ID']['input']>>;
  venueId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationDeleteProductPropertiesByIdsArgs = {
  productPropertyIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  venueId: Scalars['ID']['input'];
};


export type MutationDeleteProductsByIdsArgs = {
  productFilter?: InputMaybe<ProductFilter>;
  productIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  venueId: Scalars['ID']['input'];
};


export type MutationDeleteQrCodesByIdsArgs = {
  qrCodeIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  venueId: Scalars['String']['input'];
};


export type MutationHandleRegistrantConfirmationArgs = {
  registrantConfirmationId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  loginForm: LoginForm;
};


export type MutationPrintOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  registerForm: RegisterForm;
};


export type MutationRegisterNotificationSubscriptionArgs = {
  notificationSubscriptionForm: WebPushNotificationSubscriptionForm;
};


export type MutationRegisterPaymentModuleConsentArgs = {
  paymentModuleConsentForm: PaymentModuleConsentForm;
};


export type MutationResendRegistrantConfirmationArgs = {
  registrantEmailAddress: Scalars['String']['input'];
  verification: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  resetPasswordForm: ResetPasswordForm;
};


export type MutationSaveMenuCategoriesIndexArgs = {
  menuCategoriesIndexForm?: InputMaybe<MenuCategoriesIndexForm>;
};


export type MutationSaveMenuCategoryArgs = {
  menuCategory?: InputMaybe<MenuCategoryForm>;
};


export type MutationSaveMenuSectionTranslationArgs = {
  menuSectionTranslationForm: MenuSectionTranslationForm;
};


export type MutationSaveMenuSubcategoryArgs = {
  menuSubcategory?: InputMaybe<MenuSubcategoryForm>;
};


export type MutationSaveProductArgs = {
  productForm: ProductForm;
};


export type MutationSaveProductPropertyArgs = {
  productPropertyForm: ProductPropertyForm;
};


export type MutationSaveQrCodeArgs = {
  qrCodeForm: TableForm;
};


export type MutationSaveUserPreferencesArgs = {
  userPreferences: UserPreferencesForm;
};


export type MutationSaveVenueArgs = {
  venueForm: VenueForm;
};


export type MutationSaveVenueConfigurationArgs = {
  venueConfigurationForm: VenueConfigurationForm;
};


export type MutationSaveVenueScheduleConfigurationArgs = {
  venueScheduleConfigurationForm: VenueScheduleConfigurationForm;
};


export type MutationSaveVenueSubscriptionArgs = {
  subscriptionUpdateForm: SubscriptionUpdateForm;
};


export type MutationSaveVenueTranslationConfigurationArgs = {
  translationConfigurationForm: VenueTranslationConfigurationForm;
};


export type MutationSendForgotPasswordRequestArgs = {
  forgotPasswordForm: ForgotPasswordForm;
};


export type MutationSetupPaymentMethodArgs = {
  paymentMethodForm: UserPaymentMethodForm;
};


export type MutationUpdateAvailabilityMenuCategoriesArgs = {
  availability?: InputMaybe<Scalars['Boolean']['input']>;
  categoryIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  filter?: InputMaybe<CategoryFilter>;
  venueId: Scalars['String']['input'];
};


export type MutationUpdateAvailabilityMenuSubcategoriesArgs = {
  availability?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<SubcategoryFilter>;
  subcategoryIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  venueId: Scalars['String']['input'];
};


export type MutationUpdateAvailabilityProductPropertiesArgs = {
  availability?: InputMaybe<Scalars['Boolean']['input']>;
  propertyIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  venueId: Scalars['ID']['input'];
};


export type MutationUpdateAvailabilityProductsArgs = {
  availability?: InputMaybe<Scalars['Boolean']['input']>;
  productFilter?: InputMaybe<ProductFilter>;
  productIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  venueId: Scalars['ID']['input'];
};


export type MutationUpdateAvailabilityQrCodesArgs = {
  availability?: InputMaybe<Scalars['Boolean']['input']>;
  qrCodeIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  venueId: Scalars['String']['input'];
};

export type OrderDto = {
  __typename?: 'OrderDto';
  comments?: Maybe<Scalars['String']['output']>;
  creationDate?: Maybe<Scalars['String']['output']>;
  employeeId?: Maybe<Scalars['ID']['output']>;
  entries?: Maybe<Array<Maybe<OrderEntryDto>>>;
  id: Scalars['ID']['output'];
  isLive?: Maybe<Scalars['Boolean']['output']>;
  lastUpdateDate?: Maybe<Scalars['String']['output']>;
  orderDate?: Maybe<Scalars['String']['output']>;
  orderSequence?: Maybe<OrderSequenceDto>;
  paid?: Maybe<Scalars['Boolean']['output']>;
  paymentDate?: Maybe<Scalars['String']['output']>;
  qrCode?: Maybe<OrderQrCode>;
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
  userIds?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  venueId: Scalars['ID']['output'];
};

export type OrderEntryDto = {
  __typename?: 'OrderEntryDto';
  id: Scalars['ID']['output'];
  item?: Maybe<OrderEntryItemDto>;
  options?: Maybe<Array<Maybe<OrderEntryItemOptionDto>>>;
  quantity: Scalars['Int']['output'];
  selectedMenuItems?: Maybe<Array<Maybe<OrderEntryItemMenuItemDto>>>;
  total?: Maybe<Scalars['Float']['output']>;
};

export type OrderEntryItemDto = {
  __typename?: 'OrderEntryItemDto';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type OrderEntryItemMenuItemDto = {
  __typename?: 'OrderEntryItemMenuItemDto';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  orderEntryType?: Maybe<Scalars['String']['output']>;
  supplementCost?: Maybe<Scalars['Float']['output']>;
};

export type OrderEntryItemOptionDto = {
  __typename?: 'OrderEntryItemOptionDto';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
};

export type OrderEntryTypeDto = {
  __typename?: 'OrderEntryTypeDto';
  index?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  requiresKitchen?: Maybe<Scalars['Boolean']['output']>;
  translation?: Maybe<Scalars['String']['output']>;
};

export type OrderList = {
  __typename?: 'OrderList';
  currentPage?: Maybe<Scalars['Int']['output']>;
  elements?: Maybe<Array<Maybe<OrderDto>>>;
  totalAmountOfElements?: Maybe<Scalars['Int']['output']>;
  totalAmountOfPages?: Maybe<Scalars['Int']['output']>;
};

export type OrderQrCode = {
  __typename?: 'OrderQrCode';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type OrderSequenceDto = {
  __typename?: 'OrderSequenceDto';
  dailySequence?: Maybe<Scalars['String']['output']>;
  totalSequence: Scalars['String']['output'];
};

export type PaginationForm = {
  direction?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  properties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type PaymentMethodConfigurationDetailsDto = {
  __typename?: 'PaymentMethodConfigurationDetailsDto';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PaymentMethodConfigurationDto = {
  __typename?: 'PaymentMethodConfigurationDto';
  alipay?: Maybe<PaymentMethodConfigurationDetailsDto>;
  applePay?: Maybe<PaymentMethodConfigurationDetailsDto>;
  cardPayments?: Maybe<PaymentMethodConfigurationDetailsDto>;
  googlePay?: Maybe<PaymentMethodConfigurationDetailsDto>;
};

export type PaymentMethodDto = {
  __typename?: 'PaymentMethodDto';
  card?: Maybe<StripeCardDto>;
  id: Scalars['ID']['output'];
};

export type PaymentMethodOptionDto = {
  __typename?: 'PaymentMethodOptionDto';
  label?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PaymentModuleConsentForm = {
  timestamp?: InputMaybe<Scalars['String']['input']>;
  venueBankAccountNumber?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
  venueLocation?: InputMaybe<VenueLocationForm>;
  venueOwnerDateOfBirth?: InputMaybe<Scalars['String']['input']>;
  venuePhoneNumber?: InputMaybe<Scalars['String']['input']>;
  venueTaxNumber?: InputMaybe<Scalars['String']['input']>;
  venueWebsite?: InputMaybe<Scalars['String']['input']>;
};

export type PeriodicePrice = {
  __typename?: 'PeriodicePrice';
  periodicity?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
};

export enum PriceStatus {
  Active = 'ACTIVE',
  Paused = 'PAUSED'
}

export type ProductDto = {
  __typename?: 'ProductDto';
  available?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isMenuItem?: Maybe<Scalars['Boolean']['output']>;
  menu?: Maybe<ProductMenuDto>;
  menuCategories?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  menuSubcategories?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Maybe<ProductOptionDto>>>;
  pictureId?: Maybe<Scalars['ID']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  properties?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  requiresKitchen?: Maybe<Scalars['Boolean']['output']>;
  translations?: Maybe<Array<Maybe<TranslationDto>>>;
  types?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ProductFilter = {
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  properties?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  subcategories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ProductForm = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isMenuItem?: InputMaybe<Scalars['Boolean']['input']>;
  menu?: InputMaybe<ProductMenuForm>;
  menuCategories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  menuSubcategories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<InputMaybe<ProductOptionForm>>>;
  price?: InputMaybe<Scalars['Float']['input']>;
  properties?: InputMaybe<Array<InputMaybe<ProductPropertyForm>>>;
  requiresKitchen?: InputMaybe<Scalars['Boolean']['input']>;
  types?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  venueId: Scalars['ID']['input'];
};

export type ProductMenuDto = {
  __typename?: 'ProductMenuDto';
  itemGroups?: Maybe<Array<Maybe<ProductMenuItemGroupDto>>>;
  maxAmountOfItems?: Maybe<Scalars['Int']['output']>;
};

export type ProductMenuForm = {
  itemGroups?: InputMaybe<Array<InputMaybe<ProductMenuItemGroupForm>>>;
  maxAmountOfItems?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductMenuItemGroupDto = {
  __typename?: 'ProductMenuItemGroupDto';
  items?: Maybe<Array<Maybe<ProductMenuItemGroupItemDto>>>;
  maxAmountOfItems?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ProductMenuItemGroupForm = {
  items?: InputMaybe<Array<InputMaybe<ProductMenuItemGroupItemForm>>>;
  maxAmountOfItems?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ProductMenuItemGroupItemDto = {
  __typename?: 'ProductMenuItemGroupItemDto';
  available?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  supplementCost?: Maybe<Scalars['Float']['output']>;
};

export type ProductMenuItemGroupItemForm = {
  id: Scalars['ID']['input'];
  supplementCost?: InputMaybe<Scalars['Float']['input']>;
};

export type ProductOptionDto = {
  __typename?: 'ProductOptionDto';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  properties?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
};

export type ProductOptionForm = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  properties?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ProductPropertyDto = {
  __typename?: 'ProductPropertyDto';
  available?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  translations?: Maybe<Array<Maybe<TranslationDto>>>;
};

export type ProductPropertyForm = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  venueId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  getCustomerInvoices?: Maybe<Array<Maybe<CustomerInvoiceDto>>>;
  getGlobalOptionList?: Maybe<GlobalOptionList>;
  getMenuByVenueId?: Maybe<MenuDto>;
  getMenuCategoriesByVenueId?: Maybe<Array<Maybe<MenuCategoryDto>>>;
  getMenuSubcategoriesByMenuCategory?: Maybe<Array<Maybe<MenuSubcategoryDto>>>;
  getMenuSubcategoriesByVenueId?: Maybe<Array<Maybe<MenuSubcategoryDto>>>;
  getOrderById?: Maybe<OrderDto>;
  getOrdersByVenueIdAndStatuses?: Maybe<OrderList>;
  getProductById?: Maybe<ProductDto>;
  getProductPropertiesByVenueId?: Maybe<Array<Maybe<ProductPropertyDto>>>;
  getProductPropertyById?: Maybe<ProductPropertyDto>;
  getProductsByMenuCategory?: Maybe<Array<Maybe<ProductDto>>>;
  getProductsByVenueId?: Maybe<Array<Maybe<ProductDto>>>;
  getPublicKey?: Maybe<Scalars['String']['output']>;
  getQrCodeById?: Maybe<TableDto>;
  getQrCodesByVenueId?: Maybe<Array<Maybe<TableDto>>>;
  getUser?: Maybe<UserDto>;
  getUserRequestById?: Maybe<UserRequestDto>;
  getVenueBalanceInformation?: Maybe<VenueBalanceInformationDto>;
  getVenueById?: Maybe<VenueDto>;
  getVenueOrderStatistics?: Maybe<VenueOrderStatisticsDto>;
  isValidIBAN?: Maybe<Scalars['Boolean']['output']>;
  isValidTelephoneNumber?: Maybe<Scalars['Boolean']['output']>;
};


export type QueryGetMenuByVenueIdArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryGetMenuCategoriesByVenueIdArgs = {
  filter?: InputMaybe<CategoryFilter>;
  venueId: Scalars['ID']['input'];
};


export type QueryGetMenuSubcategoriesByMenuCategoryArgs = {
  menuCategoryId: Scalars['ID']['input'];
};


export type QueryGetMenuSubcategoriesByVenueIdArgs = {
  filter?: InputMaybe<SubcategoryFilter>;
  venueId: Scalars['ID']['input'];
};


export type QueryGetOrderByIdArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueryGetOrdersByVenueIdAndStatusesArgs = {
  orderStatuses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  paginationForm?: InputMaybe<PaginationForm>;
  venueId: Scalars['ID']['input'];
};


export type QueryGetProductByIdArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryGetProductPropertiesByVenueIdArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryGetProductPropertyByIdArgs = {
  productPropertyId: Scalars['ID']['input'];
};


export type QueryGetProductsByMenuCategoryArgs = {
  menuCategory: Scalars['ID']['input'];
};


export type QueryGetProductsByVenueIdArgs = {
  productFilter?: InputMaybe<ProductFilter>;
  venueId: Scalars['ID']['input'];
};


export type QueryGetQrCodeByIdArgs = {
  tableId: Scalars['ID']['input'];
};


export type QueryGetQrCodesByVenueIdArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryGetUserRequestByIdArgs = {
  requestId: Scalars['ID']['input'];
};


export type QueryGetVenueBalanceInformationArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryGetVenueByIdArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryGetVenueOrderStatisticsArgs = {
  venueId: Scalars['ID']['input'];
};


export type QueryIsValidIbanArgs = {
  countryCode: Scalars['String']['input'];
  iban: Scalars['String']['input'];
};


export type QueryIsValidTelephoneNumberArgs = {
  countryCode: Scalars['String']['input'];
  telephoneNumber: Scalars['String']['input'];
};

export type RegisterForm = {
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  language: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  timeStamp?: InputMaybe<Scalars['String']['input']>;
  venueName: Scalars['String']['input'];
  verification: Scalars['String']['input'];
};

export type ResetPasswordForm = {
  newPassword: Scalars['String']['input'];
  userRequestId: Scalars['ID']['input'];
};

export type RoleDto = {
  __typename?: 'RoleDto';
  name?: Maybe<Scalars['String']['output']>;
};

export type SecurityToken = {
  __typename?: 'SecurityToken';
  expirationDate?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type SocialMediumDto = {
  __typename?: 'SocialMediumDto';
  id?: Maybe<Scalars['ID']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type SocialMediumForm = {
  id: Scalars['ID']['input'];
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type StripeCardDto = {
  __typename?: 'StripeCardDto';
  brand?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  expirationMonth?: Maybe<Scalars['String']['output']>;
  expirationYear?: Maybe<Scalars['String']['output']>;
  issuer?: Maybe<Scalars['String']['output']>;
  last4Digits?: Maybe<Scalars['String']['output']>;
};

export type SubcategoryFilter = {
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  subscribeVenueBalanceInformation?: Maybe<VenueBalanceInformationDto>;
  subscribeVenueOrderStatistics?: Maybe<VenueOrderStatisticsDto>;
  subscribeVenueOrders?: Maybe<OrderDto>;
};


export type SubscriptionSubscribeVenueBalanceInformationArgs = {
  venueId: Scalars['ID']['input'];
};


export type SubscriptionSubscribeVenueOrderStatisticsArgs = {
  venueId: Scalars['ID']['input'];
};


export type SubscriptionSubscribeVenueOrdersArgs = {
  venueId: Scalars['ID']['input'];
};

export type SubscriptionUpdateForm = {
  subscriptionModuleIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  subscriptionPlanId: Scalars['ID']['input'];
};

export type TableDto = {
  __typename?: 'TableDto';
  active?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  qrCodeUrlFragment: Scalars['String']['output'];
  venueId: Scalars['ID']['output'];
};

export type TableForm = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  venueId?: InputMaybe<Scalars['ID']['input']>;
};

export type TranslationDto = {
  __typename?: 'TranslationDto';
  content?: Maybe<Array<Maybe<TranslationItemDto>>>;
  language: LanguageDto;
};

export type TranslationItemDto = {
  __typename?: 'TranslationItemDto';
  key: Scalars['ID']['output'];
  translation?: Maybe<Scalars['String']['output']>;
  validationRules?: Maybe<Array<Maybe<ValidationRuleDto>>>;
};

export type UserDto = {
  __typename?: 'UserDto';
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastLoginDate?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<PaymentMethodDto>;
  preferences?: Maybe<UserPreferencesDto>;
  registrationDate?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<RoleDto>>>;
  stripeId?: Maybe<Scalars['ID']['output']>;
  venue?: Maybe<VenueDto>;
};

export type UserFeedbackForm = {
  message?: InputMaybe<Scalars['String']['input']>;
  verification: Scalars['String']['input'];
};

export type UserForm = {
  firstName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  lastName: Scalars['String']['input'];
};

export type UserPaymentMethodForm = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  stripeCustomerId: Scalars['ID']['input'];
  stripePaymentMethodId?: InputMaybe<Scalars['ID']['input']>;
};

export type UserPreferencesDto = {
  __typename?: 'UserPreferencesDto';
  language?: Maybe<Scalars['String']['output']>;
  timeZoneId?: Maybe<Scalars['String']['output']>;
};

export type UserPreferencesForm = {
  language: Scalars['String']['input'];
  timeZoneId?: InputMaybe<Scalars['String']['input']>;
};

export type UserRequestDto = {
  __typename?: 'UserRequestDto';
  id: Scalars['ID']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type ValidationRuleDto = {
  __typename?: 'ValidationRuleDto';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type VenueBalanceInformationDto = {
  __typename?: 'VenueBalanceInformationDto';
  amountOfOrdersPaid?: Maybe<Scalars['Int']['output']>;
  nextPayout?: Maybe<FuturePayoutDetailsDto>;
};

export type VenueConfigurationDto = {
  __typename?: 'VenueConfigurationDto';
  disableQrCodesOnVenueClosed?: Maybe<Scalars['Boolean']['output']>;
  languages?: Maybe<Array<Maybe<LanguageDto>>>;
  orderLimit?: Maybe<Scalars['Int']['output']>;
  paymentMethodConfiguration?: Maybe<PaymentMethodConfigurationDto>;
  paymentThreshold?: Maybe<Scalars['Int']['output']>;
  paymentsEnabled?: Maybe<Scalars['Boolean']['output']>;
  showKitchenHours?: Maybe<Scalars['Boolean']['output']>;
  venuePrinterConfiguration?: Maybe<VenuePrinterConfigurationDto>;
  workSchedule?: Maybe<WorkScheduleDto>;
};

export type VenueConfigurationForm = {
  paymentMethodIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  paymentThreshold?: InputMaybe<Scalars['Int']['input']>;
  venueId: Scalars['ID']['input'];
};

export type VenueDto = {
  __typename?: 'VenueDto';
  accountId?: Maybe<Scalars['ID']['output']>;
  bankAccount?: Maybe<Scalars['String']['output']>;
  configuration?: Maybe<VenueConfigurationDto>;
  description?: Maybe<Scalars['String']['output']>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isDemo?: Maybe<Scalars['Boolean']['output']>;
  locale?: Maybe<Scalars['String']['output']>;
  location?: Maybe<VenueLocationDto>;
  logoId?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  owner?: Maybe<VenueOwnerDto>;
  paused?: Maybe<Scalars['Boolean']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  qrCodeUrlFragment?: Maybe<Scalars['String']['output']>;
  socialMedia?: Maybe<Array<Maybe<SocialMediumDto>>>;
  subscription?: Maybe<VenueSubscriptionDto>;
  taxNumber?: Maybe<Scalars['String']['output']>;
  taxPercentage?: Maybe<Scalars['Float']['output']>;
  translations?: Maybe<Array<Maybe<TranslationDto>>>;
  website?: Maybe<Scalars['String']['output']>;
};

export type VenueForm = {
  bankAccount?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  locale?: InputMaybe<Scalars['String']['input']>;
  location: VenueLocationForm;
  name: Scalars['String']['input'];
  owner: UserForm;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  socialMedia?: InputMaybe<Array<InputMaybe<SocialMediumForm>>>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type VenueLocationDto = {
  __typename?: 'VenueLocationDto';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type VenueLocationForm = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type VenueOrderStatisticsDto = {
  __typename?: 'VenueOrderStatisticsDto';
  amountOfOrdersReceived?: Maybe<Scalars['Int']['output']>;
  ordersValue?: Maybe<Scalars['Float']['output']>;
};

export type VenueOwnerDto = {
  __typename?: 'VenueOwnerDto';
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

export type VenuePaymentMethodConfigurationForm = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type VenuePrinterConfigurationDto = {
  __typename?: 'VenuePrinterConfigurationDto';
  automatic?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  paperMargin?: Maybe<Scalars['Float']['output']>;
  paperWidth?: Maybe<Scalars['Float']['output']>;
  printerConnectionUrl?: Maybe<Scalars['String']['output']>;
  printerName?: Maybe<Scalars['String']['output']>;
};

export type VenueScheduleConfigurationForm = {
  disableQrCodesOnVenueClosed: Scalars['Boolean']['input'];
  kitchenDaySchedules: Array<InputMaybe<VenueWorkScheduleForm>>;
  showKitchenHours: Scalars['Boolean']['input'];
  venueDaySchedules: Array<InputMaybe<VenueWorkScheduleForm>>;
  venueId: Scalars['ID']['input'];
};

export type VenueSubscriptionDetailDto = {
  __typename?: 'VenueSubscriptionDetailDto';
  features?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  index?: Maybe<Scalars['Int']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  price?: Maybe<PeriodicePrice>;
  stripeId?: Maybe<Scalars['ID']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type VenueSubscriptionDto = {
  __typename?: 'VenueSubscriptionDto';
  defaultPaymentMethod?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  moduleIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  planName?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  trialEndDate?: Maybe<Scalars['String']['output']>;
  trialStartDate?: Maybe<Scalars['String']['output']>;
};

export type VenueTranslationConfigurationForm = {
  defaultLocaleCode: Scalars['String']['input'];
  venueId: Scalars['ID']['input'];
  venueLanguageCodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type VenueWorkScheduleForm = {
  closed: Scalars['Boolean']['input'];
  day: Scalars['String']['input'];
  shifts: Array<InputMaybe<VenueWorkShiftForm>>;
};

export type VenueWorkShiftForm = {
  from: Scalars['String']['input'];
  to: Scalars['String']['input'];
};

export type WebPushNotificationSubscriptionDto = {
  __typename?: 'WebPushNotificationSubscriptionDto';
  id?: Maybe<Scalars['ID']['output']>;
  isLive?: Maybe<Scalars['Boolean']['output']>;
  subscriptionEndpoint?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
  venueId?: Maybe<Scalars['ID']['output']>;
};

export type WebPushNotificationSubscriptionForm = {
  auth?: InputMaybe<Scalars['ID']['input']>;
  endpoint: Scalars['String']['input'];
  expirationTime?: InputMaybe<Scalars['String']['input']>;
  p256dh?: InputMaybe<Scalars['ID']['input']>;
  venueId: Scalars['ID']['input'];
};

export type WorkScheduleDto = {
  __typename?: 'WorkScheduleDto';
  kitchenSchedule?: Maybe<Array<Maybe<WorkdayDto>>>;
  venueSchedule?: Maybe<Array<Maybe<WorkdayDto>>>;
};

export type WorkShiftDto = {
  __typename?: 'WorkShiftDto';
  from?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
};

export type WorkdayDto = {
  __typename?: 'WorkdayDto';
  closed: Scalars['Boolean']['output'];
  day: Scalars['String']['output'];
  shifts?: Maybe<Array<Maybe<WorkShiftDto>>>;
};
