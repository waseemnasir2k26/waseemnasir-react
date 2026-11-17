# Network footer deploy (feat/network-footer-20261109)

Branched from `feat/founding-articles-2026-11-05` (a848990), which is what is live.
No GitHub auto-deploy, and a plain production deploy does NOT move the domain: the alias must be set.
Run from this repo root, on this branch, only after the independent gate passes.

```
cd C:/Users/info/OneDrive/Desktop/GITHUB/waseemnasir-react
git checkout feat/network-footer-20261109
vercel --prod --scope waseems-projects-35f8bca4
# note the deployment URL printed: waseemnasir-<hash>-waseems-projects-35f8bca4.vercel.app
vercel alias set <deployment-url> www.waseemnasir.com --scope waseems-projects-35f8bca4
vercel alias set <deployment-url> waseemnasir.com --scope waseems-projects-35f8bca4
```

Verify the SERVED html (apex 307s to www via a dashboard setting):

```
curl -s https://www.waseemnasir.com/ | grep -o "SkynetLabs network:"
curl -s https://www.waseemnasir.com/ | grep -o 'https://skynetlabs.si/\|https://skynetlabsai.com/' | sort -u
curl -s https://www.waseemnasir.com/ | grep -o 'sameAs":\[[^]]*\]'
curl -sI https://www.waseemnasir.com/ | grep -i "age\|x-vercel-cache"
```

Rollback: `vercel alias set <previous-deployment-url> www.waseemnasir.com` (and apex).
