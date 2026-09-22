/**
 * Content for the public About College page. Vision, mission, values, programmes and headline
 * facts follow kietgroup.in/about-us; affiliation and address follow public college listings.
 * Update here when the college publishes new figures.
 */

export const ABOUT_WEBSITE = 'https://kietgroup.in/'

export const FOUNDED = 2001

export const OVERVIEW = [
  'Since its inception in 2001, the Kakinada Institute of Engineering and Technology (KIET) has become a renowned engineering institution in the state, with its campus at Korangi near Kakinada, Andhra Pradesh.',
  'Today KIET is known as the first AI college in the region. It offers more than 40 courses across engineering, computer applications and management, and works with IIIT Hyderabad on programmes such as the C4GT Hub and the KIET Smart City Lab.',
]

export const HIGHLIGHTS = [
  { value: String(FOUNDED), label: 'Year founded' },
  { value: '3', label: 'Colleges in the group' },
  { value: '40+', label: 'Courses offered' },
  { value: 'First', label: 'AI college in the region' },
]

export const VISION =
  'Envisioned as a world-class academy of excellence, KIET is dedicated to providing top-notch technical education of global standards and building future leaders.'

export const MISSION =
  'To cultivate a learning environment that sparks the passion for innovation in young minds, and to equip students to succeed academically and thrive in a dynamically evolving technological world.'

export const VALUES = ['Culture', 'Service', 'Dedication', 'Unity', 'Righteousness', 'Holistic growth']

export const COLLEGES = [
  { code: 'KIET', name: 'Kakinada Institute of Engineering and Technology', note: 'The founding college of the group, established in 2001.' },
  { code: 'KIET-II', name: 'Kakinada Institute of Engineering and Technology – II', note: 'The group’s second engineering college, listed in this portal as KIET+.' },
  { code: 'KIET-W', name: 'Kakinada Institute of Engineering and Technology for Women', note: 'The group’s college for women, listed in this portal as KIEW.' },
]

export const PROGRAMMES = [
  {
    level: 'Undergraduate',
    name: 'B.Tech',
    detail: 'Computer Science and Engineering with specialisations including Artificial Intelligence, Data Science and Cyber Security, alongside the core engineering branches.',
  },
  { level: 'Postgraduate', name: 'M.Tech', detail: 'Advanced study in engineering, including Machine Learning.' },
  { level: 'Postgraduate', name: 'MBA', detail: 'Human Resources, Marketing and Finance.' },
  { level: 'Postgraduate', name: 'MCA', detail: 'Computer applications with a focus on Artificial Intelligence and Cyber Security.' },
]

export const FACILITIES = [
  {
    key: 'sports',
    title: 'Sports grounds',
    detail: 'Cricket and football grounds, an athletics track, and tennis and basketball courts on the main campus.',
    image: '/campus/aerial-grounds.jpg',
  },
  {
    key: 'labs',
    title: 'Labs and centres',
    detail: 'The KIET Robotics Lab, the KIET Smart City Lab with IIIT Hyderabad’s Smart City Research Center, and the C4GT Hub for open-source work.',
    image: '/campus/aerial-main-block.jpg',
  },
  {
    key: 'campus',
    title: 'Campus life',
    detail: 'Technical, cultural and service clubs, including NCC and NSS, open to students of all three colleges, with college buses serving Kakinada and nearby towns.',
    image: '/campus.jpg',
    // Portrait photo: keep the KIET sign in the wide crop.
    position: 'center 72%',
  },
]

export const ACHIEVEMENTS = [
  { title: 'First AI college in the region', detail: 'Dedicated programmes in Artificial Intelligence and Data Science at undergraduate and postgraduate level.' },
  { title: 'Partner of IIIT Hyderabad', detail: 'A C4GT Hub spoke since 2023 and home to the KIET Smart City Lab, driven by IIIT-H’s Smart City Research Center.' },
  { title: 'Over two decades of engineering education', detail: `Educating engineers in the Godavari region since ${FOUNDED}.` },
]

/** Logos from Wikimedia Commons (JNTUK, AICTE, IIIT-H) and the club's own mark (C4GT). */
export const PARTNERS = [
  {
    key: 'jntuk',
    name: 'JNTU Kakinada',
    role: 'Affiliating university',
    detail: 'KIET’s degree programmes are affiliated to Jawaharlal Nehru Technological University, Kakinada.',
    logo: '/about/partners/jntuk.png',
    url: 'https://www.jntuk.edu.in/',
  },
  {
    key: 'aicte',
    name: 'AICTE',
    role: 'Approving body',
    detail: 'Programmes are approved by the All India Council for Technical Education.',
    logo: '/about/partners/aicte.png',
    url: 'https://www.aicte-india.org/',
  },
  {
    key: 'iiith',
    name: 'IIIT Hyderabad',
    role: 'Academic partner',
    detail: 'Anchors the C4GT Hub and drives the KIET Smart City Lab through its Smart City Research Center.',
    logo: '/about/partners/iiith.png',
    url: 'https://www.iiit.ac.in/',
  },
  {
    key: 'c4gt',
    name: 'C4GT',
    role: 'Open-source hub',
    detail: 'KIET has been a C4GT Hub spoke since 2023, putting students on real Digital Public Goods.',
    logo: '/clubs/c4gt.png',
    url: 'https://www.codeforgovtech.in/',
  },
]

export const AFFILIATION = 'Affiliated to Jawaharlal Nehru Technological University, Kakinada (JNTUK) and approved by AICTE.'

export const ADDRESS = 'Korangi, Yanam Road, Kakinada, Andhra Pradesh 533461'
