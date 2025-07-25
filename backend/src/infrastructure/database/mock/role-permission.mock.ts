export const mockRolePermissions = [
  // Admin gets all permissions
  { id_role: 1, id_permission: 1 },
  { id_role: 1, id_permission: 2 },
  { id_role: 1, id_permission: 3 },
  { id_role: 1, id_permission: 4 },

  // Editor gets some
  { id_role: 2, id_permission: 1 },
  { id_role: 2, id_permission: 2 },
  { id_role: 2, id_permission: 3 },

  // Viewer gets one
  { id_role: 3, id_permission: 2 },
];
