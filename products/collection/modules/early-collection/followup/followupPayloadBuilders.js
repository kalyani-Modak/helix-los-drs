export function formatDateTimeForApi(date) {
  if (!date) return null;
  if (typeof date === "string") return date.split("T")[0];
  if (date.$d) date = date.$d;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}T00:00:00`;
}

/**
 * Builds the POST body for col-followup/updateFollowup (unchanged contract vs legacy Followup.jsx).
 */
export function buildUpdateFollowupRequest({
  actionCode,
  resultCode,
  followupData,
  summary,
  pickUpRequired,
  pickUpData,
  applyToAllAccounts,
  generatedPromises,
  nextActionPayload = null,
}) {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const dtResultFallback = `${y}-${m}-${d}`;

  return {
    followupDto: {
      szCallSummary:nextActionPayload,
      szActionCode: actionCode,
      dtAction: formatDateTimeForApi(new Date()),
      szResultCode: resultCode,
      dtResultCode: dtResultFallback,
      szNextActionCode: followupData.nextAction,
      dtNextAction: formatDateTimeForApi(followupData.nextActionDate),
      szRemark: followupData.notes || followupData.szRemark || followupData.bestTimeToCall || "",
      szSummary: summary || "",
      szPartyContacted: followupData.partyContacted || "A",
      szModeContact: followupData.modeOfContact || "E",
      szPlaceContact: followupData.placeOfContact || "M",
      szPersonContacted: followupData.contactPerson || "A",
      szPartitionCode: "001",
      szLogedInUser: "ADMIN",
      szActivity: "FT2",
      szCollectorGrpCode: "T1",
      bdInstallmentODAmt: null,
      bdTotalOSAmt: 100000,
      bdPaymentAmt: 20000,
      szApplytoAllAcc: applyToAllAccounts ? "Y" : "N",
      szPickUpReq: pickUpRequired ? "Y" : "N",
      followupVisitRequestDto: {
        szVisitReference: "10182",
        szVisitFor: pickUpData.szVisitFor,
        szContactPerson: pickUpData.szContactPerson,
        dtVisitDate: formatDateTimeForApi(pickUpData.dtVisitDate),
        bdVisitForAmt: pickUpData.bdVisitForAmt,
        szAddressType: pickUpData.szAddressType,
        szRemarks: pickUpData.szRemarks,
        szPickupCollectorGrp: pickUpData.szPickupCollectorGrp,
        szPickupCollector: pickUpData.szPickupCollector,
        szAddress: pickUpData.szAddress,
      },
      dtPromiseStartDate: followupData.promiseStartDate,
      bdPromiseAmount: followupData.promiseAmount,
      szPromiseFrequency: followupData.frequency,
      noOfPromises: followupData.numberOfPromises,
      lstPromiseDetailsDtos: generatedPromises,
    },
    
  };
}
