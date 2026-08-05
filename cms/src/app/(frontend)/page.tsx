import { redirect } from 'next/navigation'

/**
 * Root of the CMS project — send visitors straight to the admin panel.
 * (The template's demo landing page is replaced; content management is the
 * whole point of this project.)
 */
export default function HomePage() {
  redirect('/admin')
}
