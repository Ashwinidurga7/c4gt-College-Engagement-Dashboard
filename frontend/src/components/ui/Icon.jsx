import React from 'react'

/**
 * Inline line-art icon set.
 *
 * Replaces the emoji glyphs the portal previously rendered in icon slots.
 * Emoji render differently on every platform, carry no accessible name, and
 * cannot inherit brand colour; these inherit `currentColor` and scale with
 * the surrounding type.
 *
 * Usage:
 *   <Icon name="student" />
 *   <Icon name="mail" size={14} />
 *   <Icon name="close" title="Close dialog" />   // adds an accessible name
 *
 * Icons are decorative by default (aria-hidden). Pass `title` only when the
 * icon is the sole content of an interactive control.
 */

const P = {
  student:
    'M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z M7 10.7v4.1c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-4.1 M21 8.5v5',
  faculty:
    'M4 19v-1.5a3.5 3.5 0 0 1 3.5-3.5h3A3.5 3.5 0 0 1 14 17.5V19 M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M17 8h4 M17 11h4 M17 14h4',
  school:
    'M4 20v-9l8-5 8 5v9 M4 20h16 M10 20v-5h4v5 M12 3v3',
  institution:
    'M3 9.5 12 4l9 5.5 M5 9.5V19 M9.5 9.5V19 M14.5 9.5V19 M19 9.5V19 M3.5 19h17',
  briefcase:
    'M3.5 8.5h17v10h-17z M9 8.5V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5v2 M3.5 13h17',
  user:
    'M5 20v-1a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1 M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  users:
    'M3 20v-1a3.5 3.5 0 0 1 3.5-3.5h4A3.5 3.5 0 0 1 14 19v1 M8.5 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M16 15.5h1a3.5 3.5 0 0 1 3.5 3.5v1 M16 12a3 3 0 0 0 0-6',
  mail:
    'M3.5 6.5h17v11h-17z M3.5 7l8.5 6 8.5-6',
  phone:
    'M7.5 4h-3v2.5A13.5 13.5 0 0 0 18 20h2.5v-3l-3.5-1.5-2 2a11 11 0 0 1-4.5-4.5l2-2Z',
  location:
    'M12 21s6.5-5.5 6.5-10a6.5 6.5 0 1 0-13 0c0 4.5 6.5 10 6.5 10Z M12 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  calendar:
    'M4 6.5h16v14H4z M4 11h16 M8.5 4v4 M15.5 4v4',
  bolt: 'M13.5 3 5.5 13.5h5L10 21l8.5-10.5h-5L13.5 3Z',
  check: 'M4.5 12.5 9.5 17.5 19.5 7',
  'check-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M8 12.2l2.8 2.8L16 9.5',
  close: 'M6 6l12 12 M18 6 6 18',
  alert: 'M12 4 2.5 20.5h19L12 4Z M12 10v4.5 M12 17.5v.5',
  'chevron-up': 'M6 14.5 12 8.5l6 6',
  'chevron-down': 'M6 9.5 12 15.5l6-6',
  'arrow-right': 'M4.5 12h15 M13.5 6l6 6-6 6',
  'trending-up': 'M4 16.5 10 10.5l3.5 3.5L20 7.5 M15 7.5h5v5',
  bus:
    'M5 5.5h14v10H5z M5 15.5v2.5h2.5v-2.5 M16.5 15.5V18H19v-2.5 M5 10h14 M8 12.8h.01 M16 12.8h.01',
  laptop: 'M5 6.5h14v9H5z M3 18.5h18',
  trophy:
    'M8 4.5h8v4a4 4 0 0 1-8 0v-4Z M8 6H5.5v1.5A2.5 2.5 0 0 0 8 10 M16 6h2.5v1.5A2.5 2.5 0 0 1 16 10 M10 12.5v2.5h4v-2.5 M8 19.5h8 M10 15h4v4.5h-4z',
  document: 'M6 3.5h8l4 4v13H6z M14 3.5v4h4 M9 12.5h6 M9 16h6',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3.5 12h17 M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z',
  award:
    'M12 14.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M9 14l-1.5 6 4.5-2.5 4.5 2.5L15 14',
  chart: 'M4 20V4 M4 20h16 M8 17V11 M12.5 17V7 M17 17v-4',
  printer:
    'M7 9V4h10v5 M5 9h14v7H5z M7 14h10v6H7z',
  save: 'M5 5.5h11L19 8.5V19H5z M8.5 5.5V10h6V5.5 M8.5 14.5h7V19h-7z',
  refresh: 'M20 12a8 8 0 1 1-2.5-5.8 M20 4v4.5h-4.5',
  star: 'M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8L12 4Z',
  wrench:
    'M15 4.5a5 5 0 0 0-5.6 6.8L4 16.7 7.3 20l5.4-5.4A5 5 0 0 0 19.5 9l-3 3-2.5-2.5 3-3A5 5 0 0 0 15 4.5Z',
  clipboard:
    'M9 4.5H6.5v16h11v-16H15 M9 3.5h6v3H9z M9.5 11h5 M9.5 15h5',
  books: 'M4 5h4.5v14H4z M8.5 5H13v14H8.5z M14 5.8l4.3 1-3 13.2-4.3-1',
  shield: 'M12 3.5 5 6v6c0 4.2 3 7.2 7 8.5 4-1.3 7-4.3 7-8.5V6l-7-2.5Z',
  flask: 'M10 3.5v6L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.5v-6 M8.5 3.5h7 M7.5 14.5h9',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M16.2 16.2 21 21',
  building: 'M5 21V4.5h14V21 M8.5 8h2 M13.5 8h2 M8.5 12h2 M13.5 12h2 M10.5 21v-4h3v4',
  upload: 'M12 16V4.5 M7.5 9 12 4.5 16.5 9 M4.5 19.5h15',
  download: 'M12 4.5V16 M7.5 11.5 12 16l4.5-4.5 M4.5 19.5h15',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5.3l3.4 2',
  megaphone: 'M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5H8l6 4V6.5l-6 4H5.5A1.5 1.5 0 0 0 4 12 M17.5 9.5a3.5 3.5 0 0 1 0 5 M8 15v4.5h3',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  'arrow-left': 'M19.5 12h-15 M10.5 6l-6 6 6 6',
  paperclip: 'M20 11.5 12 19.5a4.6 4.6 0 0 1-6.5-6.5l8-8a3.2 3.2 0 0 1 4.5 4.5l-8 8a1.8 1.8 0 0 1-2.5-2.5l7.3-7.3',
  bell: 'M18 16.5H6l1.5-2.5V11a4.5 4.5 0 0 1 9 0v3l1.5 2.5Z M10.3 19.5a2 2 0 0 0 3.4 0',
  link: 'M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5 M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5',
  flag: 'M6 21V4 M6 5h11l-2 3.5L17 12H6',
  card: 'M3.5 6h17v12h-17z M3.5 10h17 M7 14.5h3.5',
  palette:
    'M12 21a9 9 0 1 1 0-18c4.9 0 9 3.4 9 7.5 0 2.5-2 4-4.5 4H15a1.8 1.8 0 0 0-1.3 3 1.8 1.8 0 0 1-1.7 3.5Z M8 9.5h.01 M11.5 7h.01 M15.5 8h.01',
  // carried over from the per-page icon set this component replaced
  arrow: 'M4.5 12h15 M13.5 6l6 6-6 6',
  rupee: 'M7 5h10 M7 9.5h10 M7 5c4.5 0 7 1.5 7 4.5S11.5 14 7 14h1.5L16 20',
  book: 'M5 4.5h8.5A3.5 3.5 0 0 1 17 8v11.5H8.5A3.5 3.5 0 0 1 5 16V4.5Z M19 4.5v15 M8.5 9h5',
}

/** Rendered as a solid mark rather than line art. */
const SOLID = {
  dot: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z',
}

export default function Icon({ name, size = 16, title, className = '', ...rest }) {
  const solid = SOLID[name]
  const d = solid || P[name]
  if (!d) {
    if (import.meta.env?.DEV) console.warn(`<Icon> unknown name: "${name}"`)
    return null
  }
  return (
    <svg
      className={`icon${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke={solid ? 'none' : 'currentColor'}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {d.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : `M${seg}`} />
      ))}
    </svg>
  )
}
