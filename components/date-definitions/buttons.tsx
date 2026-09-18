import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import Link from "next/link"
import { deleteDateDefinition } from "@/lib/date-definitions/actions"

export function CreateDateDefinition() {
  return (
    <Link
      href="/date-definitions/create"
      className="flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <span className="hidden md:block">Create Date Definition</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  )
}

export function UpdateDateDefinition({ id }: { id: number }) {
  return (
    <Link
      href={`/date-definitions/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  )
}

export function DeleteDateDefinition({ id }: { id: number }) {
  const deleteDateDefinitionWithId = deleteDateDefinition.bind(null, id)

  return (
    <form action={deleteDateDefinitionWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  )
}
