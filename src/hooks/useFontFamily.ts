import { useEffect, useState } from "react";
import { FONT_FAMILY_LIST, isSupportFontFamily } from "@/util";
import type { OptionItem } from "@/components";
export function useFontFamily(): [
  list: OptionItem[],
  setList: React.Dispatch<React.SetStateAction<OptionItem[]>>
] {
  const [fontFamilyList, setFontFamilyList] = useState<OptionItem[]>([]);
  useEffect(() => {
    const list = FONT_FAMILY_LIST.map((v) => {
      const disabled = !isSupportFontFamily(v);
      return { label: v, value: v, disabled };
    });
    setFontFamilyList(list);
  }, []);
  return [fontFamilyList, setFontFamilyList];
}
