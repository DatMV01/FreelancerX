export enum GigStatus {
  ACTIVE = "ACTIVE",
  DRAFT = "DRAFT",
  PAUSED = "PAUSED",
  //PENDING_APPROVAL = "PENDING_APPROVAL",
  REJECTED = "REJECTED",
  // DELETED = "DELETED",
  // REQUIRE_MODIFICATION = "REQUIRE_MODIFICATION",
}

export const gigStatus = Object.values(GigStatus);
