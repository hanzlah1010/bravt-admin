export enum USER_ROLE {
  USER = "USER",
  ADMIN = "ADMIN"
}

export enum USER_PROVIDER {
  CREDENTIALS = "CREDENTIALS",
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB"
}

export enum VERIFICATION_CODE {
  VERIFY_EMAIL = "VERIFY_EMAIL",
  PASSWORD_RESET = "PASSWORD_RESET",
  CHANGE_EMAIL = "CHANGE_EMAIL"
}

export enum GLOBAL_SNAPSHOT_TYPE {
  WINDOWS = "WINDOWS",
  LINUX = "LINUX",
  OTHER = "OTHER"
}

export enum RESOURCE_TYPE {
  INSTANCE = "INSTANCE",
  FIREWALL = "FIREWALL",
  SSH = "SSH",
  SNAPSHOT = "SNAPSHOT",
  ISO = "ISO"
}

export enum PAYMENT_METHOD {
  PAYPAL = "PAYPAL",
  CREDIT_CARD = "CREDIT_CARD"
}

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  CAPTURED = "CAPTURED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED"
}

export enum ACTIVITY_ACTION {
  LOGIN = "LOGIN",
  SIGN_UP = "SIGN_UP",
  REQUEST_RESET_PASSWORD = "REQUEST_RESET_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
  SETUP_PASSWORD = "SETUP_PASSWORD",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  UPDATE_PROFILE = "UPDATE_PROFILE",
  LOGOUT = "LOGOUT",
  IMPERSONATE = "IMPERSONATE",
  STOP_IMPERSONATE = "STOP_IMPERSONATE",
  CHANGE_EMAIL = "CHANGE_EMAIL",
  CREATE_INSTANCE = "CREATE_INSTANCE",
  UPDATE_INSTANCE = "UPDATE_INSTANCE",
  DELETE_INSTANCE = "DELETE_INSTANCE",
  REBOOT_INSTANCE = "REBOOT_INSTANCE",
  REINSTALL_INSTANCE = "REINSTALL_INSTANCE",
  STOP_INSTANCE = "STOP_INSTANCE",
  START_INSTANCE = "START_INSTANCE",
  RESTORE_INSTANCE = "RESTORE_INSTANCE",
  UPDATE_BACKUP_SCHEDULE = "UPDATE_BACKUP_SCHEDULE",
  CREATE_SNAPSHOT = "CREATE_SNAPSHOT",
  DELETE_SNAPSHOT = "DELETE_SNAPSHOT",
  CREATE_FIREWALL_GROUP = "CREATE_FIREWALL_GROUP",
  UPDATE_FIREWALL_GROUP = "UPDATE_FIREWALL_GROUP",
  DELETE_FIREWALL_GROUP = "DELETE_FIREWALL_GROUP",
  CREATE_FIREWALL_RULE = "CREATE_FIREWALL_RULE",
  DELETE_FIREWALL_RULE = "DELETE_FIREWALL_RULE",
  CREATE_SSH = "CREATE_SSH",
  UPDATE_SSH = "UPDATE_SSH",
  DELETE_SSH = "DELETE_SSH",
  CREATE_ISO = "CREATE_ISO",
  DELETE_ISO = "DELETE_ISO"
}

export interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  passwordHash?: string
  role: USER_ROLE
  credits: number
  address?: string
  city?: string
  zipCode?: string
  country?: string
  companyName?: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
  provider: USER_PROVIDER
  isSubscribed?: Date
  alertSent?: Date
  secondAlertSent?: Date
  twoFactorSecret?: string
  twoFactorEnabled?: Date
  instanceCreateLimit: number
  dailyInstanceLimit: number
  dailyDeleteLimit: number
  suspended?: Date
  invitedById?: string
  invitedBy?: User
  referrals: User[]
  inviteTransactions: Transaction[]
  recoveryCodes: RecoveryCode[]
  tickets: Ticket[]
  refreshTokens: RefreshToken[]
  resources: Resource[]
  transactions: Transaction[]
  activities: Activity[]
  notifications: NotificationRecipient[]
  messagesSent: TicketMessage[]
  verificationTokens: Verification[]
}

export interface RecoveryCode {
  id: string
  code: string
  used?: Date
  createdAt: Date
  userId: string
  user: User
}

export interface Verification {
  id: string
  email: string
  code: string
  expiresAt: Date
  type: VERIFICATION_CODE
  createdAt: Date
  userId?: string
  user?: User
}

export interface RefreshToken {
  id: string
  token: string
  userAgent?: string
  ipAddress?: string
  createdAt: Date
  userId: string
  user: User
}

export interface Plan {
  id: string
  plan: string
  hourlyCost: number
  monthlyCost: number
  backupCost: number
  promotionalPrice?: number
  createdAt: Date
}

export interface GlobalSnapshot {
  id: string
  type: GLOBAL_SNAPSHOT_TYPE
}

export interface Resource {
  id: string
  startTime: Date
  creditsConsumed: number
  password?: string
  createdAt: Date
  deletedAt?: Date
  suspended?: Date
  type: RESOURCE_TYPE
  userId: string
  user: User
  activities: Activity[]
}

export interface Transaction {
  id: string
  amount: number
  transactionId: string
  method: PAYMENT_METHOD
  status: PAYMENT_STATUS
  createdAt: Date
  updatedAt: Date
  invitedById?: string
  invitedBy?: User
  userId: string
  user: User
}

export interface Activity {
  id: string
  action: ACTIVITY_ACTION
  createdAt: Date
  message: string
  userId?: string
  user?: User
  resourceId?: string
  resource?: Resource
}

export interface Ticket {
  id: string
  topic: string
  closed?: Date
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  user: User
  messages: TicketMessage[]
}

export interface TicketMessage {
  id: string
  message: string
  deleted?: Date
  seen?: Date
  images: string[]
  createdAt: Date
  updatedAt: Date
  senderId: string
  sender: User
  ticketId: string
  ticket: Ticket
}

export interface Notification {
  id: string
  title: string
  message: string
  validTill: Date
  sentToAll: boolean
  createdAt: Date
  recipients: NotificationRecipient[]
}

export interface NotificationRecipient {
  id: string
  seenAt?: Date
  userId: string
  user: User
  notificationId: string
  notification: Notification
}

export interface ApiKeys {
  id: string
  key: string
  name: string
  active: boolean
  instancesLimit: number
  createdAt: Date
  updatedAt: Date
}

export interface PaymentKey {
  id: string
  clientId: string
  clientSecret: string
  webhookId: string
  type: PAYMENT_METHOD
}

export interface SnapshotCost {
  id: string
  cost: number
}

export interface AffiliateCommission {
  id: string
  amount: number
}
