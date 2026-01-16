#!/usr/bin/env python3
import sys
import json

def calculate_paye(data):
    """
    Calculate PAYE tax based on Nigerian 2025 Finance Act rates.
    Replicates logic from fiscalreforms.ng
    """
    try:
        # Extract inputs with defaults
        gross_income = float(data.get('grossIncome', 0))
        
        # Extract Deductions
        pension = float(data.get('pension', 0))
        nhf = float(data.get('nhf', 0))
        nhis = float(data.get('nhis', 0))
        loan_interest = float(data.get('loanInterest', 0))
        life_insurance = float(data.get('lifeInsurance', 0))
        rent = float(data.get('annualRent', 0))

        # Rent Relief Logic (20% of rent, capped at ₦500,000)
        # New Law Rule: Lower of (20% of Annual Rent) or ₦500,000
        rent_relief = min(rent * 0.20, 500000) 
        
        # Total Deductions (New Law approach seems to sum these to get Taxable)
        deductions_breakdown = {
            'NHF Contribution': nhf,
            'NHIS Contribution': nhis,
            'Pension Contribution': pension,
            'Interest on Loan': loan_interest,
            'Life Insurance': life_insurance,
            'Rent Relief': rent_relief
        }
        
        total_deductions = sum(deductions_breakdown.values())
        
        # Taxable Income
        taxable_income = max(0, gross_income - total_deductions)
        
        # 2025 Tax Bands
        bands = [
            (800000, 0.00),      # First 800k @ 0%
            (2200000, 0.15),     # Next 2.2M @ 15%
            (9000000, 0.18),     # Next 9M @ 18%
            (13000000, 0.21),    # Next 13M @ 21%
            (25000000, 0.23),    # Next 25M @ 23%
            (float('inf'), 0.25) # Above @ 25% (Band is implied as remainder)
        ]
        
        tax_breakdown = []
        remaining_taxable = taxable_income
        total_tax = 0
        
        # Band 1: First 800k
        b1_limit = 800000
        b1_amount = min(remaining_taxable, b1_limit)
        b1_tax = b1_amount * 0.0
        tax_breakdown.append({'label': 'First ₦800,000 @ 0%', 'amount': b1_limit if remaining_taxable >= b1_limit else b1_amount, 'tax': b1_tax})
        remaining_taxable = max(0, remaining_taxable - b1_limit)
        
        # Band 2: Next 2.2M
        b2_limit = 2200000
        b2_amount = min(remaining_taxable, b2_limit)
        b2_tax = b2_amount * 0.15
        tax_breakdown.append({'label': 'Next ₦2,200,000 @ 15%', 'amount': b2_amount, 'tax': b2_tax})
        total_tax += b2_tax
        remaining_taxable = max(0, remaining_taxable - b2_limit)
            
        # Band 3: Next 9M
        b3_limit = 9000000
        b3_amount = min(remaining_taxable, b3_limit)
        b3_tax = b3_amount * 0.18
        tax_breakdown.append({'label': 'Next ₦9,000,000 @ 18%', 'amount': b3_amount, 'tax': b3_tax})
        total_tax += b3_tax
        remaining_taxable = max(0, remaining_taxable - b3_limit)

        # Band 4: Next 13M
        b4_limit = 13000000
        b4_amount = min(remaining_taxable, b4_limit)
        b4_tax = b4_amount * 0.21
        tax_breakdown.append({'label': 'Next ₦13,000,000 @ 21%', 'amount': b4_amount, 'tax': b4_tax})
        total_tax += b4_tax
        remaining_taxable = max(0, remaining_taxable - b4_limit)
            
        # Band 5: Next 25M
        b5_limit = 25000000
        b5_amount = min(remaining_taxable, b5_limit)
        b5_tax = b5_amount * 0.23
        tax_breakdown.append({'label': 'Next ₦25,000,000 @ 23%', 'amount': b5_amount, 'tax': b5_tax})
        total_tax += b5_tax
        remaining_taxable = max(0, remaining_taxable - b5_limit)

        # Band 6: Above 50M (Remaining)
        b6_amount = remaining_taxable
        b6_tax = b6_amount * 0.25
        tax_breakdown.append({'label': 'Above ₦50,000,000 @ 25%', 'amount': b6_amount, 'tax': b6_tax})
        total_tax += b6_tax
            
        # Calculate Effective Rate
        effective_rate = (total_tax / gross_income * 100) if gross_income > 0 else 0
        
        return {
            'success': True,
            'data': {
                'grossIncome': gross_income,
                'taxableIncome': taxable_income,
                'totalDeductions': total_deductions,
                'deductionsBreakdown': deductions_breakdown,
                'totalTax': total_tax,
                'monthlyTax': total_tax / 12,
                'effectiveRate': effective_rate,
                'taxBreakdown': tax_breakdown
            }
        }
        
    except Exception as e:
        return {'success': False, 'error': str(e)}

if __name__ == '__main__':
    # Read from stdin
    try:
        input_str = sys.stdin.read()
        if not input_str:
            print(json.dumps({'success': False, 'error': 'No input data provided'}))
        else:
            input_data = json.loads(input_str)
            result = calculate_paye(input_data)
            print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'success': False, 'error': f'Script error: {str(e)}'}))
