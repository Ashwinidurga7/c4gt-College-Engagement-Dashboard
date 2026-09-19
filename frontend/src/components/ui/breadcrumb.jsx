import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

const Breadcrumb = React.forwardRef(function Breadcrumb({
  className,
  ...props
}, ref) {
  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
})

const BreadcrumbList = React.forwardRef(function BreadcrumbList({
  className,
  ...props
}, ref) {
  return (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})

const BreadcrumbItem = React.forwardRef(function BreadcrumbItem({
  className,
  ...props
}, ref) {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
})

const BreadcrumbLink = React.forwardRef(function BreadcrumbLink({
  asChild,
  className,
  ...props
}, ref) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})

const BreadcrumbPage = React.forwardRef(function BreadcrumbPage({
  className,
  ...props
}, ref) {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
})

const BreadcrumbSeparator = React.forwardRef(function BreadcrumbSeparator({
  children,
  className,
  ...props
}, ref) {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
        <ChevronRightIcon />
      )}
    </li>
  )
})

const BreadcrumbEllipsis = React.forwardRef(function BreadcrumbEllipsis({
  className,
  ...props
}, ref) {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon
      />
      <span className="sr-only">More</span>
    </span>
  )
})

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
