import { Injectable } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { QuoteReq } from './quote-req.model';

@Injectable({
  providedIn: 'root',
})
export class QuoteReqService implements Adapter<QuoteReq> {
  constructor() {}

  adapt(form: any): QuoteReq {
    const quoteReq: QuoteReq = {
      quote_id: '{{quote_id}}',
      product_id: form?.productId,
      transaction_type: 'New',
      location_addon: [
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Third Party Liability',
          location_addon_opted: 'Yes',
          addon_si: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Owners surrounding property',
          location_addon_opted: 'No',
          addon_si: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Air freight',
          location_addon_opted: 'No',
          addon_si: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Escalation',
          location_addon_opted: 'No',
          addon_si: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Additional custom duty',
          location_addon_opted: 'No',
          addon_si: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Expediting expenses',
          location_addon_opted: 'No',
          addon_si: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Removal of Debris',
          location_addon_opted: 'No',
          addon_si: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Dismantling Cover',
          location_addon_opted: 'No',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Transit Risk',
          location_addon_opted: 'No',
          user_rate: '',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'Express Freight',
          location_addon_opted: 'No',
          puid: 'r]kXsj',
        },
        {
          location1: 'Pan India',
          type_machinery1: '{{machine}}',
          location_addon_name: 'MB Cover',
          location_addon_opted: 'No',
          puid: 'r]kXsj',
        },
      ],
      machinery: [
        {
          location: 'Pan India',
          type_machinery: '{{machine}}',
          prop_name: '{{proposition}}',
          machinery_description: 'ui',
          make: 'ui',
          model: 'ui',
          slno: 'ui',
          capacity: 'ui',
          yom: '2024',
          amc: '',
          cost_of_machinery_si: '{{com}}',
          voluntary_excess: 'Normal',
          uid: 'r]kXsj',
        },
      ],
      policy_addon: [
        {
          addon_policy: 'Marine',
          addon_policy_opted: 'No',
          marine_selection: 'All Risk',
        },
        {
          addon_policy: 'GPA',
          addon_policy_opted: 'No',
        },
      ],
      pakage_code: 'EPM', //
      imd_oa_broker_code: 'OA000177', //
      imd_oa_agent: 'OA000177', //
      settings_user_type: 'External', //
      branch_state: 'Tamilnadu', //
      branch_id: 'T3', //
      imd_channel: 'AAR', //
      imd_subchannel: 'OEM', //
      _ready: '1', //
      __finalize: 1, //
    };

    console.log('Adapted QuoteReq:', quoteReq);
    return quoteReq;
  }
}
