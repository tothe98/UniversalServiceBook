# Diff Details

Date : 2023-01-24 12:49:22

Directory d:\\Web Projects\\UniversalServiceBook

Total : 45 files,  10 codes, -18 comments, -81 blanks, all -89 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [client/.env](/client/.env) | Properties | 1 | 0 | 0 | 1 |
| [client/package.json](/client/package.json) | JSON | 1 | 0 | 0 | 1 |
| [client/public/index.html](/client/public/index.html) | HTML | 14 | 1 | 1 | 16 |
| [client/src/App.js](/client/src/App.js) | JavaScript | -5 | 0 | 1 | -4 |
| [client/src/components/InformationCard.component.jsx](/client/src/components/InformationCard.component.jsx) | JavaScript React | 48 | 0 | 5 | 53 |
| [client/src/components/Layout.component.jsx](/client/src/components/Layout.component.jsx) | JavaScript React | 50 | 0 | 6 | 56 |
| [client/src/components/Layout.jsx](/client/src/components/Layout.jsx) | JavaScript React | -47 | 0 | -6 | -53 |
| [client/src/components/RequireAuth.js](/client/src/components/RequireAuth.js) | JavaScript | -18 | -1 | -5 | -24 |
| [client/src/components/Roles.js](/client/src/components/Roles.js) | JavaScript | -7 | 0 | -1 | -8 |
| [client/src/components/VehicleCard.component.jsx](/client/src/components/VehicleCard.component.jsx) | JavaScript React | 94 | 0 | 8 | 102 |
| [client/src/context/RequireAuth.js](/client/src/context/RequireAuth.js) | JavaScript | 33 | 9 | 6 | 48 |
| [client/src/global/Footer.jsx](/client/src/global/Footer.jsx) | JavaScript React | -15 | 0 | -6 | -21 |
| [client/src/global/Header.jsx](/client/src/global/Header.jsx) | JavaScript React | -40 | 0 | -18 | -58 |
| [client/src/global/PageSelector.jsx](/client/src/global/PageSelector.jsx) | JavaScript React | 2 | 0 | -1 | 1 |
| [client/src/global/Profile.jsx](/client/src/global/Profile.jsx) | JavaScript React | -14 | -5 | -4 | -23 |
| [client/src/lib/GlobalConfigs.js](/client/src/lib/GlobalConfigs.js) | JavaScript | 9 | 0 | 2 | 11 |
| [client/src/lib/GlobalFunctions.js](/client/src/lib/GlobalFunctions.js) | JavaScript | 6 | 0 | 1 | 7 |
| [client/src/lib/GlobalIcons.js](/client/src/lib/GlobalIcons.js) | JavaScript | 78 | 0 | 1 | 79 |
| [client/src/lib/GlobalImports.js](/client/src/lib/GlobalImports.js) | JavaScript | 111 | 0 | 1 | 112 |
| [client/src/lib/Roles.js](/client/src/lib/Roles.js) | JavaScript | 7 | 0 | 1 | 8 |
| [client/src/lib/StyledComponents.js](/client/src/lib/StyledComponents.js) | JavaScript | 372 | 11 | 54 | 437 |
| [client/src/pages/AdminPage.jsx](/client/src/pages/AdminPage.jsx) | JavaScript React | -49 | -2 | -5 | -56 |
| [client/src/pages/EmailVerification.jsx](/client/src/pages/EmailVerification.jsx) | JavaScript React | 7 | 0 | -1 | 6 |
| [client/src/pages/Error.jsx](/client/src/pages/Error.jsx) | JavaScript React | 3 | 0 | 0 | 3 |
| [client/src/pages/Garage.jsx](/client/src/pages/Garage.jsx) | JavaScript React | -234 | -11 | -31 | -276 |
| [client/src/pages/GarageVehiclePreview.jsx](/client/src/pages/GarageVehiclePreview.jsx) | JavaScript React | -16 | -1 | -11 | -28 |
| [client/src/pages/Home.jsx](/client/src/pages/Home.jsx) | JavaScript React | -247 | -11 | -30 | -288 |
| [client/src/pages/Login.jsx](/client/src/pages/Login.jsx) | JavaScript React | 1 | 0 | -1 | 0 |
| [client/src/pages/MailPreview.jsx](/client/src/pages/MailPreview.jsx) | JavaScript React | -180 | -1 | -20 | -201 |
| [client/src/pages/Mails.jsx](/client/src/pages/Mails.jsx) | JavaScript React | -148 | 0 | -18 | -166 |
| [client/src/pages/MechanicWorkshop.jsx](/client/src/pages/MechanicWorkshop.jsx) | JavaScript React | -23 | -1 | -6 | -30 |
| [client/src/pages/OwnerPage.jsx](/client/src/pages/OwnerPage.jsx) | JavaScript React | 0 | 0 | -5 | -5 |
| [client/src/pages/Registration.jsx](/client/src/pages/Registration.jsx) | JavaScript React | 7 | 0 | -2 | 5 |
| [client/src/pages/Settings.jsx](/client/src/pages/Settings.jsx) | JavaScript React | -10 | -7 | -8 | -25 |
| [client/src/pages/Unauthorized.jsx](/client/src/pages/Unauthorized.jsx) | JavaScript React | 2 | 0 | -1 | 1 |
| [server/controllers/RecentActivationController.js](/server/controllers/RecentActivationController.js) | JavaScript | 49 | 0 | 3 | 52 |
| [server/controllers/VehicleController.js](/server/controllers/VehicleController.js) | JavaScript | 12 | 0 | 2 | 14 |
| [server/controllers/WorkshopController.js](/server/controllers/WorkshopController.js) | JavaScript | 14 | 0 | 0 | 14 |
| [server/core/CronService.js](/server/core/CronService.js) | JavaScript | 50 | 0 | 3 | 53 |
| [server/core/DatabaseInitialization.js](/server/core/DatabaseInitialization.js) | JavaScript | 3 | 0 | 0 | 3 |
| [server/models/RecentActivationModel.js](/server/models/RecentActivationModel.js) | JavaScript | 50 | 0 | 3 | 53 |
| [server/package-lock.json](/server/package-lock.json) | JSON | 33 | 0 | 0 | 33 |
| [server/package.json](/server/package.json) | JSON | 1 | 0 | 0 | 1 |
| [server/routes/routes.js](/server/routes/routes.js) | JavaScript | 3 | 1 | 1 | 5 |
| [server/server.js](/server/server.js) | JavaScript | 2 | 0 | 0 | 2 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details