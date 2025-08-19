# Frontend Approval & Visibility Workflow (Job Seekers)

This document explains how to integrate and display the new backend profile approval logic in the frontend.

## 1. Key Backend Fields (Profile)

| Field           | Type               | Purpose                                             |
| --------------- | ------------------ | --------------------------------------------------- | ---------- | ------------------------ |
| approvalStatus  | 'pending'          | 'approved'                                          | 'rejected' | Current moderation state |
| isActive        | boolean            | Public visibility toggle (true only after approval) |
| approvedAt      | Date               | Timestamp of approval                               |
| approvedBy      | Int (admin userId) | Who approved                                        |
| rejectionReason | String             | Reason provided when rejected                       |

## 2. Public Listing Rules

Only profiles with:

- approvalStatus === 'approved'
- isActive === true
  are returned by public endpoints (`/public/job-seekers`, `/public/job-seekers/:id`). Pending or rejected profiles are hidden automatically.

## 3. Registration Flow (Job Seeker)

After registration:

- approvalStatus = 'pending'
- isActive = false
- User cannot appear in public listings.
  Display a banner in dashboard: "Your profile is under review." until approved.

## 4. Admin Actions

New endpoints (protected):

```
PUT /api/profile/:id/approve
PUT /api/profile/:id/reject { reason }
GET /api/profile/status/pending
GET /api/profile/status/approved
GET /api/profile/status/rejected
```

Approval automatically sets: `approvalStatus='approved'`, `isActive=true`.
Rejection sets: `approvalStatus='rejected'`, `isActive=false`, and stores `rejectionReason`.
Emails are sent on both actions.

## 5. Suggested UI Indicators

| Status   | Badge Color | Message                |
| -------- | ----------- | ---------------------- |
| pending  | gray        | Awaiting review        |
| approved | green       | Publicly visible       |
| rejected | red         | Rejected (show reason) |

Example badge component props:

```tsx
<StatusBadge status={profile.approvalStatus} />
```

## 6. Conditional Rendering Examples

```tsx
if (profile.approvalStatus === "pending") {
  return <Alert type="info" message="Your profile is pending approval." />;
}
if (profile.approvalStatus === "rejected") {
  return (
    <Alert
      type="error"
      message={`Profile rejected: ${profile.rejectionReason}`}
    />
  );
}
```

Hide edit form submit? No. Allow user to continue editing while pending or after rejection.

## 7. Admin Dashboard Enhancements

Add tabs or filters:

- Pending (review queue)
- Approved
- Rejected
  Each row: name, category, submitted date, status badge, actions (Approve / Reject dialog).

Reject dialog form fields:

```
<textarea name="reason" required placeholder="Reason for rejection" />
<button type="submit">Submit</button>
```

## 8. API Consumption Patterns

Fetch pending profiles:

```ts
GET /api/profile/status/pending (auth header required)
```

Approve profile:

```ts
fetch(`/api/profile/${profileId}/approve`, {
  method: "PUT",
  headers: { Authorization: `Bearer ${token}` },
});
```

Reject profile:

```ts
fetch(`/api/profile/${profileId}/reject`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ reason }),
});
```

## 9. Caching & State Updates

After approve/reject, optimistically update local state:

```ts
setProfiles((prev) => prev.filter((p) => p.id !== profileId)); // for pending list
```

Then refetch counts/badges.

## 10. Edge Cases

- User edits profile after approval: keep approved unless admin wants re-review (not enforced yet).
- Rejected profile edited: still rejected; admin must explicitly approve.
- Missing email: no notification sent (backend handles quietly).

## 11. Future Enhancements (Optional)

- Auto-trigger re-review when critical fields change.
- In-app notifications instead of only email.
- Activity timeline showing approval events.

## 12. Minimal StatusBadge Example

```tsx
export const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-gray-200 text-gray-700",
    approved: "bg-green-200 text-green-700",
    rejected: "bg-red-200 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};
```

Keep this doc in sync with backend changes.
