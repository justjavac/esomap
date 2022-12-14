/**
 * 用给定的模版解析一个字符串。
 *
 * 例如
 * - 字符串: `Adds 40-1752 Maximum Stamina`
 * - 模版: `Adds <<1>> Maximum Stamina`
 *
 * 返回值: `["40-1752"]`
 *
 * @param str 待解析的字符串
 * @param template 模版
 */
export function resove(str: string, template: string): Record<string, string> | undefined {
  const slots: Record<string, string> = {};
  let i = 0;
  let j = 0;

  while (i < str.length && j < template.length) {
    const c = template.at(j);

    if (c === "<" && template.at(j + 1) === "<" && template.at(j + 2) !== "<") {
      // Foo <<1>> Bar
      //        ^
      //        k - 模版结束标记
      const k = template.indexOf(">>", j + 1);

      if (k === -1) {
        console.log(template);
        throw new Error("Invalid template");
      }

      // Foo <<1>> Bar
      //       ^
      //      slot - 插值
      const slot = template.slice(j + 2, k);
      const key = slot;

      // 如果模版已结束，则匹配剩余的
      if (k === template.length - 2) {
        slots[key] = str.slice(i);
        return slots;
      }

      const next5 = template.slice(k + 2, k + 7);

      let m = i + 1;
      for (; m < str.length; m++) {
        if (str.slice(m, m + 5) == next5) {
          break;
        }
      }

      if (m === str.length) {
        return undefined;
      }

      slots[key] = str.slice(i, m);
      i = m + 1;
      j = k + 3;
    } else {
      if (str.at(i) !== c) {
        return undefined;
      }

      i++;
      j++;
    }
  }

  if (i !== str.length || j !== template.length) {
    return undefined;
  }

  return slots;
}

// TODO
export function apply(template: string, slots: Record<string, string> = {}): string {
  let i = 0;
  let str = "";

  while (i < template.length) {
    const c = template.at(i);

    if (c === "<" && template.at(i + 1) === "<" && template.at(i + 2) !== "<") {
      // Foo <<1>> Bar
      //        ^
      //        k - 模版结束标记
      const k = template.indexOf(">>", i + 1);

      if (k === -1) {
        throw new Error("Invalid template");
      }

      // Foo <<1>> Bar
      //       ^
      //      slot - 插值
      const slot = template.slice(i + 2, k);
      const key = slot;

      str += slots[key];
      i = k + 2;
    } else {
      str += c;
      i++;
    }
  }

  return str;
}

if (import.meta.main) {
  const str = "Adds 123 4567 Maximum Stamina";
  const template = "Adds <<1>> Maximum <<2>>";
  console.log(apply(template, { 1: "123 4567", 2: "Stamina" }));
}
