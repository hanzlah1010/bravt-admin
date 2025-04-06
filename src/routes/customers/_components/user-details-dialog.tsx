import { formatDate } from "date-fns"
import {
  AlertTriangleIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CameraIcon,
  DatabaseIcon,
  KeyIcon,
  MailIcon,
  ShieldIcon,
  UserIcon
} from "lucide-react"

import { formatBytes, formatPrice } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useUserByIdQuery } from "@/queries/use-user-by-id-query"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { UsageBar } from "@/components/usage-bar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import type { ResourceBilling, User } from "@/types/db"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router"

type UserDetailsDialogProps = {
  rowUser?: User
  open: boolean
  onOpenChange: () => void
}

export default function UserDetailsDialog({
  rowUser,
  ...props
}: UserDetailsDialogProps) {
  const { data: user, status, refetch } = useUserByIdQuery(rowUser?.id ?? "")

  return (
    <Sheet {...props}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
        {status === "pending" ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : status === "error" || !user ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <AlertTriangleIcon className="size-6" />
            <h2 className="text-sm text-muted-foreground">
              Something went wrong, please try again!
            </h2>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>User Instance Usage</SheetTitle>
              <SheetDescription>
                View instance usage statistics and resource counts
              </SheetDescription>
            </SheetHeader>

            <Separator className="my-4" />

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  User Information
                </h3>
                <Card>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-center space-x-3">
                      <MailIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">{user.email}</span>
                    </div>

                    {user.firstName && (
                      <div className="flex items-center space-x-3">
                        <UserIcon className="size-4 text-muted-foreground" />
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Instance Usage
                </h3>

                <Card className="w-full">
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Today&apos;s Activity
                      </h3>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-primary/15 p-2 text-primary">
                            <ArrowUpCircleIcon size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Created
                            </p>
                            <p className="text-lg font-semibold">
                              {user.instancesCreatedToday}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                            <ArrowDownCircleIcon size={20} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Deleted
                            </p>
                            <p className="text-lg font-semibold">
                              {user.instancesDeletedToday}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <UsageBar
                        current={user.instancesCreatedToday}
                        limit={user.dailyInstanceLimit}
                        label="Daily Create Limit"
                      />

                      <UsageBar
                        current={user.instancesDeletedToday}
                        limit={user.dailyDeleteLimit}
                        label="Daily Delete Limit"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        All-Time Usage
                      </h3>
                      <UsageBar
                        current={user.instancesCount}
                        limit={user.instanceCreateLimit}
                        label="Total Instance Limit"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Resource Counts
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <ResourceCard
                    title="Instances"
                    count={user.instancesCount}
                    icon={DatabaseIcon}
                    href={`/instances?label=${user.email}`}
                  />
                  <ResourceCard
                    title="Snapshots"
                    count={user.snapshotsCount}
                    icon={CameraIcon}
                    href={`/snapshots?description=${user.email}`}
                  />
                  <ResourceCard
                    title="Firewall Groups"
                    count={user.firewallCount}
                    icon={ShieldIcon}
                    href={`/firewall-groups?description=${user.email}`}
                  />
                  <ResourceCard
                    title="SSH Keys"
                    count={user.sshCount}
                    icon={KeyIcon}
                    href={`/ssh-keys?name=${user.email}`}
                  />
                </div>
              </div>

              {user.billingHistory.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Billing History
                  </h3>

                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="pl-6">Date</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="pr-6 text-right">
                              Amount
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.billingHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="whitespace-nowrap pl-6">
                                {formatDate(item.billedAt, "PP hh:mm aa")}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {formatBillingDescription(item)}
                              </TableCell>
                              <TableCell className="whitespace-nowrap pr-6">
                                {formatPrice(item.amount, 7)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export function formatBillingDescription({
  reason,
  details,
  id,
  unitsCharged
}: ResourceBilling) {
  const label = (details.label ?? details.id ?? id) as string

  switch (reason) {
    case "INSTANCE_CREATION":
      return (
        <>
          Instance <strong>{label}</strong> created (plan: {details.plan})
        </>
      )

    case "INSTANCE_HOURLY_BILLING":
      return (
        <>
          Hourly charge for instance <strong>{label}</strong> (IP:{" "}
          {details.ip ?? "unknown"})
          {unitsCharged > 1 && ` for ${unitsCharged} hours`}
        </>
      )

    case "EARLY_INSTANCE_DELETION":
      return (
        <>
          Early deletion of instance <strong>{label}</strong> (before 30 days)
        </>
      )

    case "SNAPSHOT_CREATION":
      return (
        <>
          Snapshot <strong>{label}</strong> created
        </>
      )

    case "SNAPSHOT_MONTHLY_BILLING":
      return (
        <>
          Monthly charge for snapshot <strong>{label}</strong> (
          {formatBytes((details.snapshotSize ?? 0) as number)}
          {unitsCharged > 1 ? ` for ${unitsCharged} months` : ""})
        </>
      )

    default:
      return <>Billing event: {reason}</>
  }
}

function ResourceCard({
  count,
  title,
  href,
  icon: Icon
}: {
  count: number
  title: string
  href: string
  icon: LucideIcon
}) {
  return (
    <Link to={href}>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="rounded-md bg-primary/15 p-2 text-primary">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {title}
                </p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
