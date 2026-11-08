"""
Script to expand Sri Balaji regional delivery coverage:
1. Ensure all 30 Odisha districts are represented in ServiceablePincode.
2. Standardize district names (Balangir, Kendujhar) with aliases.
3. Add Serango, Gurandi, Nandigam, Ichchapuram, Chhatrapur, and Angul.
4. Ensure all nearby locations (Ranipeta, Gumma, Mohana, R. Udayagiri, Adava, Serango, Chandragiri, Gurandi, Garabandha)
   and AP border towns (Pathapatnam, Palasa, Kasibugga, Tekkali, Srikakulam, Amadalavalasa, Nandigam, Sompeta, Ichchapuram)
   and regional hubs (Gunupur, Berhampur, Digapahandi, Chhatrapur, Gopalpur, Rayagada, Bhubaneswar, Cuttack)
   are directly queryable by city name, locality, mandal, or PIN code.
"""
import json
import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal
from app.models.logistics import ServiceablePincode

NEW_LOCATIONS = [
    {
        'pincode': '759122',
        'city': 'Angul',
        'district': 'Angul',
        'state': 'Odisha',
        'zone_name': 'Central Odisha Industrial Corridor',
        'serviceability_status': 'REGULAR',
        'localities': 'Angul Town, Amalapada, Mishrapada, Collectorate Area, Bazar Road, Banarpal, Nalco Nagar',
        'transport_modes': json.dumps(['State Roadlines', 'Bus Cargo']),
        'transit_duration_label': '2-3 Days',
        'min_delivery_days': 2,
        'max_delivery_days': 3,
        'standard_shipping_rate': 50.0,
        'delivery_charges_text': '₹50 flat / carton',
        'delivery_conditions': 'Scheduled bus parcel and state roadlines dispatch from South Odisha hub.',
        'cod_available': True,
        'daily_transit_available': True,
        'notes': 'District headquarters for Angul.'
    },
    {
        'pincode': '761208',
        'city': 'Serango',
        'district': 'Gajapati',
        'state': 'Odisha',
        'zone_name': 'Gajapati Regional Route',
        'serviceability_status': 'REGULAR',
        'localities': 'Serango Bazar, Gumma Road, Christian Sahi, Ajayagada, Hill Market, Serango Mandal',
        'transport_modes': json.dumps(['Regional Carrier Tempo', 'Bus Cargo']),
        'transit_duration_label': '1-2 Days',
        'min_delivery_days': 1,
        'max_delivery_days': 2,
        'standard_shipping_rate': 40.0,
        'delivery_charges_text': '₹40 flat / carton',
        'delivery_conditions': 'Daily factory delivery van/tempo link from Paralakhemundi (15 km).',
        'cod_available': True,
        'daily_transit_available': True,
        'notes': 'Serango hill area route.'
    },
    {
        'pincode': '761210',
        'city': 'Gurandi',
        'district': 'Gajapati',
        'state': 'Odisha',
        'zone_name': 'Gajapati Regional Route',
        'serviceability_status': 'REGULAR',
        'localities': 'Gurandi Bazar, Gosani Block, High School Road, Krushnapur, Uppalada Road, Gurandi Mandal',
        'transport_modes': json.dumps(['Regional Carrier Tempo', 'Bus Cargo']),
        'transit_duration_label': 'Same Day - 1 Day',
        'min_delivery_days': 1,
        'max_delivery_days': 1,
        'standard_shipping_rate': 35.0,
        'delivery_charges_text': '₹35 flat / carton',
        'delivery_conditions': 'Direct local factory van delivery twice daily from Paralakhemundi.',
        'cod_available': True,
        'daily_transit_available': True,
        'notes': 'Gurandi Gosani block route.'
    },
    {
        'pincode': '532204',
        'city': 'Nandigam',
        'district': 'Srikakulam',
        'state': 'Andhra Pradesh',
        'zone_name': 'AP Border Route',
        'serviceability_status': 'REGULAR',
        'localities': 'Nandigam Junction, Main Road, Palasa-Tekkali Highway, Kaviti Road, Nandigam Mandal',
        'transport_modes': json.dumps(['State Roadlines', 'Bus Cargo']),
        'transit_duration_label': '1-2 Days',
        'min_delivery_days': 1,
        'max_delivery_days': 2,
        'standard_shipping_rate': 45.0,
        'delivery_charges_text': '₹45 flat / carton',
        'delivery_conditions': 'Daily bus cargo and transport vans via NH-16 corridor.',
        'cod_available': True,
        'daily_transit_available': True,
        'notes': 'Nandigam AP border corridor.'
    },
    {
        'pincode': '532312',
        'city': 'Ichchapuram',
        'district': 'Srikakulam',
        'state': 'Andhra Pradesh',
        'zone_name': 'AP Border Route',
        'serviceability_status': 'REGULAR',
        'localities': 'Ichchapuram Town, RTC Bus Stand, Border Checkpost, Main Bazar, Bellupada, Ichchapuram Mandal',
        'transport_modes': json.dumps(['State Roadlines', 'Bus Cargo']),
        'transit_duration_label': '1-2 Days',
        'min_delivery_days': 1,
        'max_delivery_days': 2,
        'standard_shipping_rate': 45.0,
        'delivery_charges_text': '₹45 flat / carton',
        'delivery_conditions': 'Daily roadline transit connecting Berhampur and Srikakulam border.',
        'cod_available': True,
        'daily_transit_available': True,
        'notes': 'Ichchapuram Andhra-Odisha gateway.'
    },
    {
        'pincode': '761020',
        'city': 'Chhatrapur',
        'district': 'Ganjam',
        'state': 'Odisha',
        'zone_name': 'Ganjam Coastal Route',
        'serviceability_status': 'REGULAR',
        'localities': 'Chhatrapur Collectorate Area, Main Bazar, Court Road, Station Road, Potagarh, Chhatrapur Block',
        'transport_modes': json.dumps(['State Roadlines', 'Bus Cargo', 'Regional Carrier Tempo']),
        'transit_duration_label': '1-2 Days',
        'min_delivery_days': 1,
        'max_delivery_days': 2,
        'standard_shipping_rate': 40.0,
        'delivery_charges_text': '₹40 flat / carton',
        'delivery_conditions': 'Direct daily road transit via Berhampur NH-16 corridor.',
        'cod_available': True,
        'daily_transit_available': True,
        'notes': 'Ganjam district headquarters.'
    }
]


def expand_coverage():
    db = SessionLocal()
    try:
        # Standardize Bolangir -> Balangir
        bolangir = db.query(ServiceablePincode).filter(ServiceablePincode.district == 'Bolangir').first()
        if bolangir:
            print("Standardizing Bolangir -> Balangir")
            bolangir.district = 'Balangir'
            locs = bolangir.localities or ''
            if 'Bolangir' not in locs:
                bolangir.localities = f"{locs}, Bolangir, Bolangir Town".strip(', ')
            db.commit()

        # Standardize Keonjhar -> Kendujhar
        keonjhar = db.query(ServiceablePincode).filter(ServiceablePincode.district == 'Keonjhar').first()
        if keonjhar:
            print("Standardizing Keonjhar -> Kendujhar")
            keonjhar.district = 'Kendujhar'
            locs = keonjhar.localities or ''
            if 'Keonjhar' not in locs:
                keonjhar.localities = f"{locs}, Keonjhar, Keonjhar Town".strip(', ')
            db.commit()

        # Ensure Mohana has Adava and Chandragiri in localities
        mohana = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == '761206').first()
        if mohana:
            locs = mohana.localities or ''
            additions = []
            for item in ['Adava', 'Chandragiri', 'Mohana Mandal']:
                if item not in locs:
                    additions.append(item)
            if additions:
                mohana.localities = f"{locs}, {', '.join(additions)}".strip(', ')
                db.commit()

        # Ensure Rayagada Gajapati has Garabandha
        garabandha_pin = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == '761211').first()
        if garabandha_pin:
            locs = garabandha_pin.localities or ''
            if 'Garabandha' not in locs:
                garabandha_pin.localities = f"{locs}, Garabandha".strip(', ')
                db.commit()

        # Ensure Paralakhemundi has Ranipeta
        parala = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == '761200').first()
        if parala:
            locs = parala.localities or ''
            if 'Ranipeta' not in locs:
                parala.localities = f"{locs}, Ranipeta".strip(', ')
                db.commit()

        # Insert or update new locations
        for p in NEW_LOCATIONS:
            rec = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == p['pincode']).first()
            if not rec:
                db.add(ServiceablePincode(**p))
                print(f"Added new PIN record: {p['city']} ({p['pincode']}) - {p['district']}, {p['state']}")
            else:
                for k, v in p.items():
                    setattr(rec, k, v)
                print(f"Updated existing PIN record: {p['city']} ({p['pincode']})")

        db.commit()

        # Verification of 30 Odisha districts
        records = db.query(ServiceablePincode).all()
        odisha_districts = sorted(set(r.district for r in records if r.state == 'Odisha' and r.district))
        print(f"\nTotal PIN records now in DB: {len(records)}")
        print(f"Odisha districts count: {len(odisha_districts)}: {odisha_districts}")
    finally:
        db.close()


if __name__ == '__main__':
    expand_coverage()
