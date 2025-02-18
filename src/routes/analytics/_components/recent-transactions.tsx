import { Link } from "react-router"

import { formatPrice } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRecentTransactionsQuery } from "@/queries/use-recent-transactions-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export function RecentTransactions() {
  const { data, isPending } = useRecentTransactionsQuery()

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          Showing some recent transactions you received
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-y-5">
          {isPending
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-h-[42.5px] items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-3.5 w-40 rounded" />
                      <Skeleton className="h-3 w-52 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
              ))
            : data.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {item.user.firstName?.[0]?.toUpperCase()}
                        {item.user.lastName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium">
                        {item.user.firstName} {item.user.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.user.email}
                      </span>
                    </div>
                  </div>

                  <span className="font-semibold">
                    +{formatPrice(item.amount, 2)}
                  </span>
                </li>
              ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="mx-auto">
          <Link to="/transactions">View all</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
