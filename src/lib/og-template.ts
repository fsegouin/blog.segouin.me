// Mirrors the tokens in src/styles/global.css. Kept as literals because
// Satori renders outside the browser and can't read CSS variables.
const colors = {
  bg: "#ffffff",
  bgSoft: "#f4f4f4",
  fg: "#1a1a1a",
  fgMuted: "#4a4a4a",
  gray: "#6b6b6b",
  rule: "#e4e4e4",
};

export function getOgTemplate(
  title: string,
  description: string,
  tags: string[] = [],
) {
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
                    fontFamily: "Lora",
                    fontWeight: 600,
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
                        backgroundColor: colors.bgSoft,
                        border: `1px solid ${colors.rule}`,
                        borderRadius: "6px",
                        padding: "6px 16px",
                      },
                      children: tag,
                    },
                  })),
                },
              },
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
