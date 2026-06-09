# 🧪 Testing Guide for Mkulima AI

Comprehensive testing strategies and checklists before deployment.

## ✅ Pre-Launch Testing Checklist

### Functionality Testing

- [ ] **Chat Works**
  - [ ] User can type message
  - [ ] Message appears in chat
  - [ ] AI responds within 5 seconds
  - [ ] Response streams in real-time

- [ ] **Dark Mode**
  - [ ] Toggle button works
  - [ ] Theme persists on page reload
  - [ ] All colors are visible in dark mode
  - [ ] No text contrast issues

- [ ] **Sidebar**
  - [ ] Quick advice buttons work
  - [ ] Sidebar toggles on mobile
  - [ ] Menu closes on selection
  - [ ] "Did you know?" section displays

- [ ] **Chat Actions**
  - [ ] Clear chat button works
  - [ ] Confirmation dialog appears
  - [ ] Chat history actually clears
  - [ ] New welcome message appears

- [ ] **Responsiveness**
  - [ ] Mobile (320px - 480px)
  - [ ] Tablet (481px - 768px)
  - [ ] Desktop (769px+)
  - [ ] Landscape orientation works

### Performance Testing

- [ ] **Page Load**
  - [ ] Initial load < 3 seconds
  - [ ] Lighthouse score > 90
  - [ ] No layout shift (CLS < 0.1)
  - [ ] FCP < 2 seconds

- [ ] **Chat Performance**
  - [ ] Responses stream smoothly
  - [ ] No lag when typing
  - [ ] Scrolling is smooth
  - [ ] Memory doesn't leak (DevTools)

- [ ] **Bundle Size**
  - [ ] Main JS < 150KB gzipped
  - [ ] CSS < 30KB gzipped
  - [ ] Total < 200KB gzipped

### Compatibility Testing

- [ ] **Browsers**
  - [ ] Chrome/Chromium (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)

- [ ] **Mobile Devices**
  - [ ] iPhone (iOS 14+)
  - [ ] Android (Android 10+)
  - [ ] Tablets
  - [ ] Various screen sizes

- [ ] **Network Conditions**
  - [ ] 4G/LTE
  - [ ] WiFi
  - [ ] Slow 3G (DevTools throttle)
  - [ ] Offline handling

### Accessibility Testing

- [ ] **Keyboard Navigation**
  - [ ] Tab through elements
  - [ ] Enter submits message
  - [ ] Shift+Tab works
  - [ ] Focus visible

- [ ] **Screen Reader**
  - [ ] Messages readable
  - [ ] Buttons labeled
  - [ ] Images have alt text
  - [ ] Form inputs labeled

- [ ] **Color Contrast**
  - [ ] WCAG AA standard (4.5:1)
  - [ ] Dark mode contrast OK
  - [ ] Light mode contrast OK

- [ ] **Font Sizes**
  - [ ] Text minimum 16px on mobile
  - [ ] Readable without zooming
  - [ ] Scale properly

### Security Testing

- [ ] **API Key Security**
  - [ ] Key not exposed in code
  - [ ] Key not in browser console logs
  - [ ] Key not in network requests visible
  - [ ] Environment variables set correctly

- [ ] **Data Privacy**
  - [ ] No sensitive data logged
  - [ ] Chat history cleared on demand
  - [ ] No tracking without consent
  - [ ] HTTPS only

- [ ] **Form Security**
  - [ ] No XSS vulnerability (try: `<script>alert('xss')</script>`)
  - [ ] Input sanitization works
  - [ ] No SQL injection possible

### Error Handling

- [ ] **Missing API Key**
  - [ ] Shows helpful error message
  - [ ] Suggests solution
  - [ ] Doesn't crash app

- [ ] **Network Error**
  - [ ] Shows offline message
  - [ ] Can retry request
  - [ ] Doesn't lose chat history

- [ ] **Long Responses**
  - [ ] Long messages don't break layout
  - [ ] Scrolling still smooth
  - [ ] Text wraps properly

- [ ] **Edge Cases**
  - [ ] Very long message (1000+ chars)
  - [ ] Empty message (should not send)
  - [ ] Special characters: emoji, symbols
  - [ ] Multiple rapid messages

## 🧑‍💻 Manual Testing Procedures

### Test 1: Basic Chat Flow

**Steps:**
1. Load app in browser
2. Type: "Tell me about maize farming"
3. Watch response stream
4. Type: "What about pests?"
5. Verify context awareness

**Expected:**
- Messages appear in correct order
- AI responds to context
- Timestamps are correct
- Scroll to latest message auto-happens

### Test 2: Mobile Experience

**Steps:**
1. Open DevTools (F12)
2. Toggle responsive design (Ctrl+Shift+M)
3. Select iPhone SE (375px)
4. Type message
5. Toggle sidebar
6. Test in landscape

**Expected:**
- Text readable without zooming
- Buttons easily tappable (44px+)
- Sidebar drawer works
- No horizontal scroll

### Test 3: Dark Mode

**Steps:**
1. Click moon icon in header
2. Reload page
3. Verify theme persists
4. Scroll through chat
5. Check all elements visible

**Expected:**
- Dark background appears
- Text is readable
- Colors appropriately adjusted
- No white text on white background

### Test 4: Error Handling

**Steps:**
1. Remove API key from .env
2. Restart dev server
3. Try to send message
4. Observe error

**Expected:**
- Clear error message appears
- App doesn't crash
- Can't send messages
- Helpful guidance shown

### Test 5: Performance

**Steps:**
1. Open DevTools → Performance tab
2. Record while sending message
3. Wait for complete response
4. Stop recording
5. Analyze results

**Expected:**
- Main thread responsive
- No long tasks (>50ms)
- FCP < 2s
- LCP < 4s

## 🔧 Browser Developer Tools Testing

### Chrome DevTools

**Network Tab:**
- Check API requests
- Verify API key sent in request
- Monitor response size
- Check cache headers

**Console Tab:**
```javascript
// Test API key availability
console.log(import.meta.env.VITE_GEMINI_API_KEY)

// Test chat history
console.log(sessionStorage.getItem('mkulima_chat_history'))

// Monitor errors
// (should see no red errors)
```

**Performance Tab:**
- Record during chat message
- Check main thread usage
- Look for long tasks
- Verify smooth scrolling

**Lighthouse Tab:**
- Run audit
- Check score (90+)
- Review suggestions
- Test accessibility

### Firefox DevTools

**Network Monitor:**
- Similar to Chrome
- Check request/response
- Verify API calls

**Console:**
- Same JavaScript tests
- View logs and warnings

**Performance:**
- Record performance profile
- Analyze flame graph

## 📊 Test Results Template

```markdown
## Test Session: [Date/Time]

### Environment
- Browser: Chrome/Firefox/Safari
- OS: Windows/Mac/Linux
- Network: WiFi/4G/3G
- Node Version: v18.x
- npm Version: 9.x

### Results

**Functionality: ✅ PASS / ❌ FAIL**
- Chat works: ✅
- Dark mode: ✅
- Sidebar: ✅
- Clear chat: ✅

**Performance: ✅ PASS / ⚠️ ISSUES**
- Load time: 1.5s
- Lighthouse: 95
- CLS: 0.05

**Issues Found:**
1. [Issue description]
   - Severity: Low/Medium/High
   - Steps to reproduce: ...
   - Expected: ...
   - Actual: ...

**Recommendations:**
- [Suggestion 1]
- [Suggestion 2]

**Sign-off:** ✅ Ready for deployment
```

## 🚀 Pre-Deployment Verification

### Final Checks (Run 24 hours before deploy)

```bash
# 1. Clean build
npm run clean
npm run build

# 2. Check build output
ls -lh dist/

# 3. Run locally
npm run preview

# 4. Test in incognito (clear cache)
# Open http://localhost:4173 in incognito window

# 5. Check for console errors
# Open DevTools → Console tab
# Should be empty (no red errors)

# 6. Test chat functionality
# Send 3-5 messages
# Verify streaming works

# 7. Lighthouse audit
# In DevTools: Lighthouse → Run audit
# Should score 90+

# 8. Deploy
npm run deploy
```

## 🔍 Post-Deployment Verification

### Verify Live Site

1. **Visit URL**
   - https://your-project.web.app
   - Should load in < 3 seconds

2. **Test Functionality**
   - Send test message
   - Verify response appears
   - Check dark mode works
   - Test mobile responsive

3. **Check Performance**
   - Open Lighthouse in DevTools
   - Run audit
   - Should score 85+

4. **Monitor Errors**
   - Check Firebase Console
   - View Hosting logs
   - No error spikes

5. **Test Across Devices**
   - Desktop computer
   - Smartphone
   - Tablet
   - Different browsers

## 🎯 Testing Frequency

| Test Type | Frequency | Triggers |
|-----------|-----------|----------|
| Manual | Every commit | Code changes |
| Functionality | Before deploy | Release |
| Performance | Weekly | Optimization |
| Cross-browser | Monthly | Major updates |
| Accessibility | Monthly | Feature adds |
| Security | Quarterly | Version updates |

## 📋 Common Test Issues & Fixes

### Issue: API Key not working in tests

**Solution:**
```bash
# Verify .env.local exists
cat .env.local

# Make sure key is correct
# Restart dev server
npm run dev
```

### Issue: Slow response times

**Check:**
- Network throttling in DevTools
- API rate limits
- Browser cache

### Issue: Styling breaks on mobile

**Fix:**
- Use DevTools responsive mode
- Test actual device if possible
- Check Tailwind breakpoints

### Issue: Dark mode not saving

**Solution:**
```javascript
// In DevTools console
localStorage.clear()
// Then test again
```

## 🎓 Best Practices

1. **Test Early, Test Often**
   - Don't wait until end to test
   - Test features as built

2. **Use Real Devices**
   - Emulators are helpful but not complete
   - Test on actual phone if possible

3. **Test Edge Cases**
   - Very long messages
   - Special characters
   - Rapid interactions

4. **Document Issues**
   - Screenshot errors
   - Note steps to reproduce
   - Track fix status

5. **Automate When Possible**
   - Add GitHub Actions CI/CD
   - Run Lighthouse automatically
   - Automate performance checks

## 📞 Support

For testing issues:
- Check browser console for errors
- Verify environment setup
- Review this guide
- Ask in community channels

---

**Happy Testing! 🧪**

Version: 1.0.0
Last Updated: March 2026
