// "use client"

// import Link from "next/link"
// import { Save } from "lucide-react"
// import { useState } from "react"
// import type { DateDefinition } from "@/lib/types"

// function sortDefinitions(definitions: DateDefinition[]) {
//   return [...definitions].sort(
//     (a, b) =>
//       (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
//       a.name.localeCompare(b.name)
//   )
// }

// export default function DateDefinitionEditor({
//   initialDefinitions,
// }: {
//   initialDefinitions: DateDefinition[]
// }) {
//   const [definitions, setDefinitions] = useState(
//     sortDefinitions(initialDefinitions)
//   )
//   const [message, setMessage] = useState("")
//   const [isSaving, setIsSaving] = useState(false)

//   function updateDefinition(
//     index: number,
//     name: keyof DateDefinition,
//     value: string | number | null
//   ) {
//     setDefinitions((current) =>
//       current.map((definition, definitionIndex) =>
//         definitionIndex === index
//           ? { ...definition, [name]: value }
//           : definition
//       )
//     )
//   }

//   async function submit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     setIsSaving(true)
//     setMessage("保存中")

//     const response = await fetch("/api/date-definitions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(definitions),
//     })
//     const result = await response.json()

//     setIsSaving(false)

//     if (!response.ok) {
//       setMessage(result.message || "保存失败")
//       return
//     }

//     setDefinitions(sortDefinitions(result.definitions))
//     setMessage("已保存")
//   }

//   return (
//     <main className="manage-page">
//       <header className="manage-topbar">
//         <div>
//           <span className="eyebrow">统计日期</span>
//           <h1>统计日期定义</h1>
//           <p>维护工作日、周、月、季度的统计归集口径，保存后进度统计页面会按最新定义展示。</p>
//         </div>
//         <nav>
//           <Link href="/progress">进度修改</Link>
//           <Link href="/date-definition">统计日期</Link>
//         </nav>
//       </header>

//       <form className="edit-form date-definition-editor" onSubmit={submit}>
//         <div className="form-heading">
//           <div>
//             <h2>日期口径</h2>
//             <p>周期类型固定，统计区间按切换时间、切换星期和切换日自动计算。</p>
//           </div>
//           <span>{message}</span>
//         </div>

//         <section className="form-section">
//           <div className="line-stack">
//             {definitions.map((definition, index) => (
//               <fieldset className="line-panel" key={definition.period_type}>
//                 <legend>
//                   <span>{definition.name}</span>
//                 </legend>
//                 <div className="form-grid">
//                   <label>
//                     周期名称
//                     <input
//                       required
//                       value={definition.name}
//                       onChange={(event) =>
//                         updateDefinition(index, "name", event.target.value)
//                       }
//                     />
//                   </label>
//                   <label>
//                     周期类型
//                     <input readOnly value={definition.period_type} />
//                   </label>
//                   {definition.period_type === "work_day" && (
//                     <label>
//                       当天开始日期
//                       <select
//                         value={definition.day_start_offset ?? -1}
//                         onChange={(event) =>
//                           updateDefinition(
//                             index,
//                             "day_start_offset",
//                             Number(event.target.value)
//                           )
//                         }
//                       >
//                         <option value={-1}>上一自然日</option>
//                         <option value={0}>本自然日</option>
//                         <option value={1}>下一自然日</option>
//                       </select>
//                     </label>
//                   )}
//                   <label>
//                     日切换时间
//                     <input
//                       required
//                       step="1"
//                       type="time"
//                       value={definition.day_cutoff_time}
//                       onChange={(event) =>
//                         updateDefinition(
//                           index,
//                           "day_cutoff_time",
//                           event.target.value
//                         )
//                       }
//                     />
//                   </label>
//                   {definition.period_type === "week" && (
//                     <label>
//                       周统计切换星期
//                       <select
//                         value={definition.week_cutoff_dow ?? 5}
//                         onChange={(event) =>
//                           updateDefinition(
//                             index,
//                             "week_cutoff_dow",
//                             Number(event.target.value)
//                           )
//                         }
//                       >
//                         <option value={0}>周日</option>
//                         <option value={1}>周一</option>
//                         <option value={2}>周二</option>
//                         <option value={3}>周三</option>
//                         <option value={4}>周四</option>
//                         <option value={5}>周五</option>
//                         <option value={6}>周六</option>
//                       </select>
//                     </label>
//                   )}
//                   {(definition.period_type === "month" ||
//                     definition.period_type === "quarter") && (
//                     <label>
//                       月/季度切换日
//                       <input
//                         max={31}
//                         min={1}
//                         required
//                         type="number"
//                         value={definition.month_cutoff_day ?? 25}
//                         onChange={(event) =>
//                           updateDefinition(
//                             index,
//                             "month_cutoff_day",
//                             Number(event.target.value)
//                           )
//                         }
//                       />
//                     </label>
//                   )}
//                   <label>
//                     排序
//                     <input
//                       type="number"
//                       value={definition.sort_order}
//                       onChange={(event) =>
//                         updateDefinition(
//                           index,
//                           "sort_order",
//                           Number(event.target.value)
//                         )
//                       }
//                     />
//                   </label>
//                 </div>
//               </fieldset>
//             ))}
//           </div>
//         </section>

//         <div className="form-actions">
//           <button disabled={isSaving} type="submit">
//             <Save aria-hidden="true" />
//             {isSaving ? "保存中" : "保存"}
//           </button>
//         </div>
//       </form>
//     </main>
//   )
// }
