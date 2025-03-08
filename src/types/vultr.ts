export type VultrPlan = {
  id: string
  locations: string[]
  hourly_cost: number
  monthly_cost: number
  type: "vc2"
  ram: number
  vcpu_count: number
}

export type VultrInstance = {
  id: string
  plan: string
  label: string
  hostname: string
  date_created: string
  power_status: "running" | "stopped"
  status: "locked" | "active"
  server_status: "installingbooting" | "ok"
  default_password?: string
  features: string[]
}

export type VultrSSHKey = {
  id: string
  name: string
  ssh_key: string
  date_created: string
}

export type VultrFirewallGroup = {
  id: string
  description: string
  date_created: string
}

export type VultrFirewallRule = {
  id: string
}

export type VultrSnapshot = {
  id: string
  description: string
  size: number
  compressed_size: number
  status: "pending" | "complete"
  date_created: string
}

export type VultrISO = {
  id: string
  filename: string
  url: string
  size: number
  status: "pending" | "complete"
  md5sum: string
  date_created: string
}

export type VultrOS = {
  id: string
  family: string
}

export type VultrBackupSchedule = {
  enabled: boolean
  type: string
  next_scheduled_time_utc: string
  hour: number
  dow: number
  dom: number
}

export type VultrBackup = {
  id: string
  date_created: string
  description: string
  size: number
  status: string
  os_id: number
  app_id: number
}
