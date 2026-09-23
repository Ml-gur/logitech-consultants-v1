import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import RouteFallback from './components/Loading'
import HomePage from './pages/HomePage'
import { CmsProvider } from './lib/CmsProvider'
import './index.css'

/**
 * Route table.
 *
 * The home page is statically imported because it is the entry point and
 * shares its chunks with the layout. Every other route is code-split, so the
 * first paint ships only what the landing page needs; each chunk shows
 * `RouteFallback` (a layout-stable skeleton) while it downloads.
 *
 * Legacy routes are kept as redirects rather than dropped, so existing inbound
 * links and anything already indexed keep working.
 */
const AboutPage = lazy(() => import('./pages/AboutPage'))
const CapabilitiesPage = lazy(() => import('./pages/CapabilitiesPage'))
const DeploymentPatternsPage = lazy(() => import('./pages/DeploymentPatternsPage'))
const DeploymentPatternDetail = lazy(() => import('./pages/DeploymentPatternDetail'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NairobiPillarPage = lazy(() => import('./pages/NairobiPillarPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CmsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/about"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route
              path="/capabilities"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <CapabilitiesPage />
                </Suspense>
              }
            />
            <Route
              path="/deployment-patterns"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <DeploymentPatternsPage />
                </Suspense>
              }
            />
            <Route
              path="/deployment-patterns/:slug"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <DeploymentPatternDetail />
                </Suspense>
              }
            />
            <Route
              path="/blog"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <BlogPage />
                </Suspense>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <BlogPostPage />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="/ai-automation-nairobi"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <NairobiPillarPage />
                </Suspense>
              }
            />
            <Route
              path="/privacy"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <PrivacyPage />
                </Suspense>
              }
            />
            <Route
              path="/terms"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <TermsPage />
                </Suspense>
              }
            />

            {/* Legacy URLs, the case-studies section became deployment patterns. */}
            <Route path="/case-studies" element={<Navigate to="/deployment-patterns" replace />} />
            <Route path="/case-studies/:slug" element={<Navigate to="/deployment-patterns" replace />} />

            {/* 404, every unmatched path renders the branded page. */}
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </CmsProvider>
  </React.StrictMode>
)
