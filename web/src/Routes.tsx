// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import RequireAuth from 'src/components/RequireAuth/RequireAuth'

const Routes = () => {
  return (
    <Router>
      <Route path="/" page={WelcomePage} name="welcome" />
      <Route path="/auth" page={AuthPage} name="auth" />
      <Set wrap={RequireAuth}>
        <Route path="/home" page={HomePage} name="home" />
        <Route path="/profile" page={ProfilePage} name="profile" />
        <Route path="/ai-robot" page={AiRobotPage} name="aiRobot" />
        <Route path="/ads-status" page={AdsStatusPage} name="adsStatus" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
