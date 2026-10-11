import { getImageProps } from "next/image";

// Basalf logo, swapped on the OS color scheme. Tailwind's dark: variant can't
// do it: darkMode is "class" and nothing sets .dark. Each app serves both files
// from its public/ folder.
export function BasalfLogo({ size = 60 }: { size?: number }) {
  const common = { alt: "Basalf", width: size, height: size };
  const {
    props: { srcSet: dark },
  } = getImageProps({ ...common, src: "/basalf-dark-mode.webp" });
  const { props: light } = getImageProps({
    ...common,
    src: "/basalf-light-mode.webp",
  });

  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={dark} />
      <img {...light} />
    </picture>
  );
}
