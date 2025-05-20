"use client"

import type React from "react"
import { forwardRef, type ReactElement } from "react"
import {
  NativeSelect,
  Group,
  InputElement,
  type BoxProps,
} from "@chakra-ui/react"

interface Option {
  label: string
  value: string | number
}

export interface SelectProps
  extends Omit<BoxProps, "onBlur" | "onChange" | "value" | "name"> {
  /** placeholder shown when no value is selected */
  placeholder?: string
  /** list of options */
  options: Option[]
  /** size token: affects height, font-size, etc. */
  size?: "sm" | "md" | "lg"
  /** width of the whole control */
  width?: string | number

  /** select props */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  value?: string | number
  name?: string

  /** an element rendered at the “start” (left) of the select */
  startElement?: ReactElement
  startElementProps?: BoxProps
  /** an element rendered at the “end” (right) of the select) */
  endElement?: ReactElement
  endElementProps?: BoxProps

  /** how far the select’s padding-start should be pushed in when startElement is present */
  startOffset?: string
  /** same for padding-end */
  endOffset?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      placeholder = "Выберите значение",
      options,
      size = "md",
      width = "full",
      onChange,
      onBlur,
      value,
      name,

      startElement,
      startElementProps,
      endElement,
      endElementProps,
      startOffset = "6px",
      endOffset = "6px",

      ...boxProps
    },
    ref,
  ) {
    // compute extra padding if icons are present:
    const ps = startElement
      ? `calc(var(--input-height) + ${startOffset})`
      : undefined
    const pe = endElement
      ? `calc(var(--input-height) + ${endOffset})`
      : undefined

    return (
      <Group ref={ref as any} width={width} {...boxProps}>
        {startElement && (
          <InputElement pointerEvents="none" {...startElementProps}>
            {startElement}
          </InputElement>
        )}

        <NativeSelect.Root size={size} width="100%">
          <NativeSelect.Field
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            ps={ps}
            pe={pe}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        {endElement && (
          <InputElement placement="end" {...endElementProps}>
            {endElement}
          </InputElement>
        )}
      </Group>
    )
  },
)

Select.displayName = "Select"
