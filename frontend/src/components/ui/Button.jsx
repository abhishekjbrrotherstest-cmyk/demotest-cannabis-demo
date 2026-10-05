import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'bg-brand text-cream hover:bg-brand-600',
  secondary: 'bg-gold text-brand-800 hover:bg-gold-500',
  outline: 'border border-brand text-brand hover:bg-brand hover:text-cream',
  'outline-light': 'border border-cream/60 text-cream hover:bg-cream hover:text-brand',
  ghost: 'text-brand-700 hover:bg-brand-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const SIZES = {
  sm: 'min-h-9 px-3.5 text-xs',
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-12 px-6 text-base',
};

function classes(variant = 'primary', size = 'md', className = '') {
  return `${VARIANTS[variant]} ${SIZES[size]} btn-base ${className}`;
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button type={props.type || 'button'} className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ variant = 'primary', size = 'md', className = '', to, children, ...props }) {
  return (
    <Link to={to} className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}