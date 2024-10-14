"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useAtom } from "jotai"
import { searchAtom } from "./ComponentsListMainPage"
import { Input } from "@/components/ui/input"
import { Hotkey } from "./ui/hotkey"
import { useIsMobile } from "@/utils/useMediaQuery"
import { HeaderServer } from "./HeaderServer"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

// Импортируем uiSystems и componentTypes из HeaderServer
import { uiSystems, componentTypes } from "./HeaderServer"

interface HeaderProps {
  tagName?: string
  page?: string
}

export function Header({ tagName, page }: HeaderProps) {
  const isHomePage = page === "home"
  const isPublishPage = page === "publish"
  const isComponentsPage = page === "components"
  const [searchTerm, setSearchTerm] = useAtom(searchAtom)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      } else if (event.key === "Escape") {
        inputRef.current?.blur()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <header className="flex fixed top-0 left-0 right-0 h-14 z-50 items-center justify-between border-b border-gray-200 px-4 py-3 bg-white">
      <div className="flex items-center gap-4">
        <HeaderServer
          tagName={tagName}
          isHomePage={isHomePage}
          isComponentsPage={isComponentsPage}
          isMobile={isMobile}
        />
        {!isMobile && !tagName && !isComponentsPage && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>UI Systems</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {uiSystems.map((system) => (
                      <ListItem
                        key={system.title}
                        title={system.title}
                        href={system.href}
                      >
                        {system.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Component Types</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {componentTypes.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>

      <div className="flex items-center gap-4">
        <HeaderServer.SocialIcons />
        <div className="relative flex items-center max-w-[400px]">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-14"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
            <Hotkey keys={["K"]} modifier={true} />
          </div>
        </div>

        {!isMobile && (
          <>
            <SignedIn>
              {!isPublishPage && (
                <Button asChild>
                  <Link href="/publish">Publish</Link>
                </Button>
              )}
              <UserButton />
            </SignedIn>
            <SignedOut>
              <div className="text-sm">
                <SignInButton />
              </div>
            </SignedOut>
          </>
        )}
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
