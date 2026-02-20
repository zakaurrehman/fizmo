import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "DEPOSIT_APPROVED"
  | "DEPOSIT_REJECTED"
  | "WITHDRAWAL_APPROVED"
  | "WITHDRAWAL_REJECTED"
  | "KYC_DOCUMENT_REVIEW"
  | "CLIENT_STATUS_CHANGED"
  | "AML_ALERT_UPDATED"
  | "ACCOUNT_CREATED"
  | "ACCOUNT_SUSPENDED"
  | "ADMIN_LOGIN"
  | "MANUAL_DEPOSIT_CREATED"
  | "MANUAL_WITHDRAWAL_CREATED";

export interface AuditLogPayload {
  [key: string]: any;
}

/**
 * Log an audit event to the database
 * @param brokerId - Broker context
 * @param userId - Admin who performed the action
 * @param action - Type of action
 * @param entityType - Type of entity (deposit, withdrawal, client, etc)
 * @param entityId - ID of the entity affected
 * @param payload - Additional context/details
 */
export async function logAudit(
  brokerId: string,
  userId: string,
  action: AuditAction,
  entityType: string,
  entityId: string,
  payload?: AuditLogPayload
) {
  try {
    await prisma.audit.create({
      data: {
        brokerId,
        actor: userId,
        action,
        target: `${entityType}:${entityId}`,
        payload: payload || {},
      },
    });
  } catch (error) {
    // Log errors but don't fail the main operation
    console.error(`Failed to log audit event: ${action}`, error);
  }
}

/**
 * Convenience wrapper for deposit approval/rejection
 */
export async function auditDepositChange(
  brokerId: string,
  userId: string,
  depositId: string,
  status: "COMPLETED" | "REJECTED",
  amount: number,
  clientEmail: string
) {
  return logAudit(
    brokerId,
    userId,
    status === "COMPLETED" ? "DEPOSIT_APPROVED" : "DEPOSIT_REJECTED",
    "deposit",
    depositId,
    {
      status,
      amount,
      clientEmail,
      timestamp: new Date(),
    }
  );
}

/**
 * Convenience wrapper for withdrawal approval/rejection
 */
export async function auditWithdrawalChange(
  brokerId: string,
  userId: string,
  withdrawalId: string,
  status: "COMPLETED" | "REJECTED",
  amount: number,
  clientEmail: string
) {
  return logAudit(
    brokerId,
    userId,
    status === "COMPLETED" ? "WITHDRAWAL_APPROVED" : "WITHDRAWAL_REJECTED",
    "withdrawal",
    withdrawalId,
    {
      status,
      amount,
      clientEmail,
      timestamp: new Date(),
    }
  );
}

/**
 * Convenience wrapper for AML alert updates
 */
export async function auditAMLAlertUpdate(
  brokerId: string,
  userId: string,
  alertId: string,
  newStatus: string,
  clientId: string
) {
  return logAudit(
    brokerId,
    userId,
    "AML_ALERT_UPDATED",
    "aml_alert",
    alertId,
    {
      newStatus,
      clientId,
      timestamp: new Date(),
    }
  );
}
