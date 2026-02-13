// Gruvbox dark palette (matches src/styles/global.css)
const colors = {
  bg: "#282828",
  bgSoft: "#32302f",
  fg: "#ebdbb2",
  fgMuted: "#a89984",
  gray: "#928374",
  orange: "#fe8019",
};

export function getOgTemplate(title: string, description: string, tags: string[] = []) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        padding: "60px",
      },
      children: [
        // Top: site name
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: "24px",
              color: colors.gray,
            },
            children: "blog.segouin.me",
          },
        },
        // Center: title + description
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Geist Sans",
                    fontWeight: 700,
                    fontSize: "56px",
                    color: colors.fg,
                    lineHeight: 1.2,
                    maxWidth: "900px",
                  },
                  children: title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Geist Sans",
                    fontSize: "24px",
                    color: colors.fgMuted,
                    maxWidth: "900px",
                  },
                  children: description,
                },
              },
            ],
          },
        },
        // Bottom: tags + author
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            },
            children: [
              // Tags
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: "12px",
                  },
                  children: tags.map((tag) => ({
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        fontFamily: "Geist Sans",
                        fontSize: "18px",
                        color: colors.fgMuted,
                        border: `1px solid ${colors.gray}`,
                        borderRadius: "6px",
                        padding: "6px 16px",
                      },
                      children: tag,
                    },
                  })),
                },
              },
              // Author
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Geist Sans",
                    fontSize: "20px",
                    color: colors.gray,
                  },
                  children: "Florent Segouin",
                },
              },
            ],
          },
        },
      ],
    },
  };
}
