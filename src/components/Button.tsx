import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import './Button.css'

type Variant = 'primary' | 'ghost'

function classes(variant: Variant, block?: boolean, extra?: string) {
  return ['btn', `btn--${variant}`, block ? 'btn--block' : '', extra ?? ''].filter(Boolean).join(' ')
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  block?: boolean
}

export function Button({ variant = 'primary', block, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={classes(variant, block, className)} {...rest} />
}

interface ButtonLinkProps extends LinkProps {
  variant?: Variant
  block?: boolean
}

export function ButtonLink({ variant = 'primary', block, className, ...rest }: ButtonLinkProps) {
  return <Link className={classes(variant, block, className)} {...rest} />
}
