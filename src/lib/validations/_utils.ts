export function decimalSchema(max = 3): [(val: number) => boolean, string] {
  const validate = (val: number) => {
    const str = val.toString()
    const decimalIndex = str.indexOf(".")
    if (decimalIndex === -1) return true
    const decimalPart = str.slice(decimalIndex + 1).replace(/0+$/, "")
    return decimalPart.length <= max
  }

  const message = `Number must have at most ${max} decimal places`
  return [validate, message]
}
