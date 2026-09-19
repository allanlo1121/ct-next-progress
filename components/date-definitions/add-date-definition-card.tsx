import { Plus } from "lucide-react"
import { DateDefinitionDrawer } from "./create-date-definition-drawer"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

type AddDateDefinitionCardProps = {
  onSave: (
    formData: FormData
  ) => Promise<{ success: boolean }>
}

export function AddDateDefinitionCard({
  onSave,
}: AddDateDefinitionCardProps) {
  return (
    <Card className="aspect-square w-full max-w-md border-dashed">
      <CardContent className="flex h-full items-center justify-center">
        <DateDefinitionDrawer
          onSave={onSave}
          trigger={
            <button
              type="button"
              className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground transition-colors hover:text-primary"
            >
              <div className="flex size-14 items-center justify-center rounded-full border border-dashed">
                <Plus className="size-7" />
              </div>

              <span className="text-sm font-medium">
                新增日期定义
              </span>
            </button>
          }
        />
      </CardContent>
    </Card>
  )
}