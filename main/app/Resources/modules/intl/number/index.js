import {trans} from '#/main/app/intl/translation'

// todo add parse display value

// todo configurable precision
// todo configurable M separator
// todo configurable decimal separator

function precision(num, decimals) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

function humanize(num = 0, base, octet = false) {
  const roundSteps = {
    1: octet ? trans('unit_kilooctet') : trans('unit_kilo'),
    2: octet ? trans('unit_megaoctet') : trans('unit_mega'),
    3: octet ? trans('unit_gigaoctet') : trans('unit_giga'),
    4: octet ? trans('unit_teraoctet') : trans('unit_tera')
  }

  let unit = ''
  let rounder = 1

  const steps = Object.keys(roundSteps)
  for (let i = 1; i < steps.length; i++) {
    const limit = Math.pow(base, i)
    if (num >= limit) {
      rounder = limit
      unit = roundSteps[i]
    }
  }

  return precision(num / rounder, 1) + unit
}

function number(num, short = false, decimals = 1, octet = false) {
  if (short) {
    return humanize(num, 1000, octet)
  }

  return precision(num, decimals)
}

function fileSize(num, short = true) {
  if (short) {
    return humanize(num, 1024)
  }

  return precision(num, 1)
}

export {
  number,
  fileSize,
  precision
}
