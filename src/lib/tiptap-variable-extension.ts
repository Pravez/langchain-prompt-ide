import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"

export const VariableHighlight = Extension.create({
  name: "variableHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("variableHighlight"),
        props: {
          decorations(state) {
            const { doc } = state
            const decorations: Decoration[] = []

            doc.descendants((node, pos, parent) => {
              if (node.isText && node.text) {
                const regex = /\{[\w-]+\}/g
                let match

                const isInsideCode =
                  parent?.type.name === "codeBlock" ||
                  parent?.type.name === "code"

                while ((match = regex.exec(node.text)) !== null) {
                  const from = pos + match.index
                  const to = from + match[0].length

                  decorations.push(
                    Decoration.inline(from, to, {
                      class: isInsideCode
                        ? "bg-white/20 text-white rounded px-0.5 border border-white/30 font-medium"
                        : "bg-primary/20 text-primary rounded px-0.5 border border-primary/30 font-medium",
                    })
                  )
                }
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
