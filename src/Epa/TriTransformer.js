module.exports = function(Transformer){

  var TriTransformer = new Transformer(function(model){

    for(var x in model){
      if(model[x] == ""){
        model[x] = null;
      }
    }

    var sic = [
      model.SIC_2,
      model.SIC_3,
      model.SIC_4,
      model.SIC_5,
      model.SIC_6
    ].filter(function(item){
      return item != null && item != "NA";
    });

    var naics = [
      model.NAICS_2,
      model.NAICS_3,
      model.NAICS_4,
      model.NAICS_5,
      model.NAICS_6
    ].filter(function(item){
      return item != null && item != "NA";
    });

    var parentCompany = function(){
      if(model.PARENT_COMPANY_DB_NUMBER == "NA"){
        return null;
      }

      return {
        "id": model.PARENT_COMPANY_DB_NUMBER,
        "name": model.PARENT_COMPANY_NAME
      };
    }();

    return {
      "documentControlNumber": model.DOC_CTRL_NUM,
      "formType": model.FORM_TYPE,
      "year": model.YEAR,
      "facility": {
        "id": model.TRI_FACILITY_ID,
        "name": model.FACILITY_NAME,
        "parentCompany": parentCompany,
        "address": {
          "streetAddress": model.STREET_ADDRESS,
          "city": model.CITY,
          "county": model.COUNTY,
          "state": model.ST,
          "zipcode": model.ZIP
        },
        "biaCode": model.BIA_CODE,
        "tribeName": model.TRIBE,
        "latitude": model.LATITUDE,
        "longitude": model.LONGITUDE,
        "sicCodes": {
          "primary": model.PRIMARY_SIC,
          "supplemental": sic
        },
        "naicsCodes": {
          "primary": model.PRIMARY_NAICS,
          "supplemental": naics
        }
      },
      "chemical": {
        "name": model.CHEMICAL,
        "casNumber": model['/COMPOUND_ID'],
        "isCleanAirActChemical": model.CLEAR_AIR_ACT_CHEMICAL == "YES" ? true : false,
        "classification": model.CLASSIFICATION,
        "isMetal": model.METAL == "YES" ? true : false,
        "metalCategory": model.METAL_CATEGORY,
        "isCarcinogen": model.CARCINOGEN == "YES" ? true : false
      },
      "unitOfMeasure": model.UNIT_OF_MEASURE,
      "quantitiesEnteringEnvironment": {
        "fugitiveAir": model['5.1_FUGITIVE_AIR'],
        "stackAir": model['5.2_STACK_AIR'],
        "water": model['5.3_WATER'],
        "undergroundClass1": model['5.4.1_UNDERGROUND_CLASS_I'],
        "undergroundClass2-5": model['5.4.2_UNDERGROUND_CLASS_II-V'],
        "rcraCLandfills": model['5.5.1A_RCRA_C_LANDFILLS'],
        "otherLandfills": model['5.5.1B_OTHER_LANDFILLS'],
        "landTreatment": model['5.5.2_LAND_TREATMENT'],
        "surfaceImpoundment": model['5.5.3_SURFACE_IMPOUNDMENT'],
        "rcraCSurfaceImpoundment": model['5.5.3A_RCRA_C_SURFACE_IMP.'],
        "otherSurfaceImpoundment": model['5.5.3B_Other_SURFACE_IMP.'],
        "otherDisposal": model['5.5.4_OTHER_DISPOSAL'],
        "totals": {
          "onsiteReleaseTotal": model['ON-SITE_RELEASE_TOTAL']
        }
      },
      "transfersToOffsiteLocations": {
        "potwTransfersForRelease": model['6.1_POTW-TRANSFERS_FOR_RELEASE'],
        "potwTransfersForTreatment": model['6.1_POTW-TRANSFERS_FOR_TREATM.'],
        "offsiteStorage": model['6.2_M10'],
        "offsiteSolidificationStabilizationMetals": model['6.2_M41'],
        "offsiteWastewaterTreatmentExcludePotw": model['6.2_M62'],
        "offsiteUndergroundInjection": model['6.2_M71'],
        "offsiteUndergroundInjectionClass1Wells": model['6.2_M81'],
        "offsiteUndergroundInjectionClass2Wells": model['6.2_M82'],
        "offsiteLandfill": model['6.2_M72'],
        "offsiteSurfaceImpoundment": model['6.2_M63'],
        "offsiteSubtitleCSurfaceImpoundment": model['6.2_M66'],
        "offsiteOtherSurfaceImpoundment": model['6.2_M67'],
        "offsiteOtherLandfills": model['6.2_M64'],
        "offsiteRcraSubtitleCLandfill": model['6.2_M65'],
        "offsiteLandTreatment": model['6.2_M73'],
        "offsiteOtherLandDisposal": model['6.2_M79'],
        "offsiteOtherOffsiteManagement": model['6.2_M90'],
        "offsiteTransferToWasteBrokerDisposal": model['6.2_M94'],
        "offsiteUnknown": model['6.2_M99'],
        "offsiteSolventsOrganicsRecovery": model['6.2_M20'],
        "offsiteMetalsRecovery": model['6.2_M24'],
        "offsiteOtherReuseRecovery": model['6.2_M26'],
        "offsiteAcidRegeneration": model['6.2_M28'],
        "offsiteTransferToWasteBrokerRecycling": model['6.2_M93'],
        "offsiteEnergyRecovery": model['6.2_M56'],
        "offsiteTransferToWasteBrokerEnergyRecovery": model['6.2_M92'],
        "offsiteSolidicationStabilization": model['6.2_M40'],
        "offsiteIncenerationThermalTreatment": model['6.2_M50'],
        "offsiteIncenerationInsignificantFueldValue": model['6.2_M54'],
        "offsiteWasteTreatmentExcludePotw": model['6.2_M61'],
        "offsiteOtherWasteTreatment": model['6.2_M69'],
        "offsiteTransferToWasteBrokerExcludeWasteTreatment": model['6.2_M95'],
        "totals": {
          "potwTotalTransfers": model['6.1_POTW-TOTAL_TRANSFERS'],
          "offsiteReleaseTotal": model['OFF-SITE_RELEASE_TOTAL'],
          "offsiteRecycledTotal": model['OFF-SITE_RECYCLED_TOTAL'],
          "offsiteRecoveryTotal": model['OFF-SITE_RECOVERY_TOTAL'],
          "offsiteTreatedTotal": model['OFF-SITE_TREATED_TOTAL'],
        }
      },
      "onsiteAndOffsiteTotalReleases": model.TOTAL_RELEASES,
      "disposalSourceReductionRecycling": {
        "onsiteContainedReleases": model['8.1A_ON-SITE_CONTAINED_REL.'],
        "onsiteOtherReleases": model['8.1B_ON-SITE_OTHER_RELEASES'],
        "offsiteContainedReleases": model['8.1C_OFF-SITE_CONTAINED_REL.'],
        "offsiteOtherReleases": model['8.1D_OFF-SITE_OTHER_RELEASES'],
        "onsiteEnergyRecovery": model['8.2_ENERGY_RECOVERY_ON-SITE'],
        "offsiteEnergyRecovery": model['8.3_ENERGY_RECOVERY_OFF-SITE'],
        "onsiteRecycling": model['8.4_RECYCLING_ON-SITE'],
        "offsiteRecycling": model['8.5_RECYCLING_OFF-SITE'],
        "onsiteTreatment": model['8.6_TREATMENT_ON-SITE'],
        "offsiteTreatment": model['8.7_TREATMENT_OFF-SITE'],
        "oneTimeRelease": model['8.8_ONE-TIME_RELEASE'],
        "totals": {
          "totalReleases": model['8.1_RELEASES'],
          "productionWaste": model['PROD._WASTE_(8.1_THRU_8.7)']
        }
      },
      "productionRatio": parseFloat( model['8.9_PRODUCTION_RATIO'] )
    };
  });

  return TriTransformer;
}
