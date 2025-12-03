# Consistency Score Calculation Documentation

## Overview

The Consistency Score is a metric that measures how regular and predictable a user's menstrual cycle is. It ranges from 0% to 100%, where higher scores indicate more consistent cycle patterns.

## Calculation Methodology

### Step 1: Calculate Actual Cycle Lengths

The consistency score is based on **actual cycle lengths** calculated from consecutive period start dates, not the user's configured cycle length.

#### Formula:
```
Actual Cycle Length = Days between consecutive period start dates
```

#### Process:
1. Sort all periods by start date (ascending order)
2. For each pair of consecutive periods, calculate the difference:
   ```javascript
   cycleLength = (nextPeriod.startDate - previousPeriod.startDate) / (1000 * 60 * 60 * 24)
   ```
3. Filter out invalid cycles:
   - Must be at least 14 days (minimum realistic cycle length)
   - Must be less than 90 days (maximum realistic cycle length)
   - Dates must be valid

#### Example:
```
Period 1: January 1, 2024
Period 2: January 29, 2024
Period 3: February 26, 2024

Cycle Length 1: 29 - 1 = 28 days ✓ (valid: 14-90 days)
Cycle Length 2: 26 - 29 = 28 days ✓ (valid: 14-90 days, accounting for month boundaries)
```

**Note:** If two periods were entered in the same month with less than 14 days between them, that cycle would be filtered out. For example:
```
Period 1: January 5, 2024
Period 2: January 15, 2024
Cycle Length: 10 days ✗ (filtered out: < 14 days minimum)
```

### Step 2: Calculate Average Cycle Length

The mean (average) of all actual cycle lengths:

```
Average Cycle Length = Σ(cycleLengths) / n
```

Where:
- `Σ(cycleLengths)` = Sum of all cycle lengths
- `n` = Number of cycle lengths

#### Example:
```
Cycle Lengths: [28, 30, 27, 29, 28]
Average = (28 + 30 + 27 + 29 + 28) / 5 = 28.4 days
```

### Step 3: Calculate Variance and Standard Deviation

#### Variance:
```
Variance = Σ((cycleLength - mean)²) / n
```

#### Standard Deviation:
```
Standard Deviation = √(Variance)
```

#### Example:
```
Cycle Lengths: [28, 30, 27, 29, 28]
Mean: 28.4

Variance = [(28-28.4)² + (30-28.4)² + (27-28.4)² + (29-28.4)² + (28-28.4)²] / 5
         = [0.16 + 2.56 + 1.96 + 0.36 + 0.16] / 5
         = 5.2 / 5
         = 1.04

Standard Deviation = √1.04 = 1.02 days
```

### Step 4: Calculate Coefficient of Variation (CV)

The Coefficient of Variation is a normalized measure of dispersion, expressed as a percentage:

```
CV = (Standard Deviation / Mean) × 100
```

Or as a decimal:
```
CV = Standard Deviation / Mean
```

#### Why CV?
- CV is unitless and allows comparison across different cycle lengths
- It measures relative variability, not absolute
- A cycle with mean 28 days and stdDev 2 days has different consistency than a cycle with mean 35 days and stdDev 2 days

#### Example:
```
Mean: 28.4 days
Standard Deviation: 1.02 days
CV = 1.02 / 28.4 = 0.0359 (or 3.59%)
```

### Step 5: Convert CV to Consistency Score

The consistency score converts the CV to a 0-100 scale:

```
Consistency Score = max(0, min(100, 100 - (CV × 500)))
```

#### Formula Breakdown:
- **CV of 0** (perfect consistency) → Score = 100%
- **CV of 0.2** (20% variation) → Score = 0%
- **CV between 0 and 0.2** → Score scales linearly from 100% to 0%

#### Conversion Table:

| CV | Variation | Consistency Score |
|----|-----------|-------------------|
| 0.00 | 0% | 100% |
| 0.02 | 2% | 90% |
| 0.04 | 4% | 80% |
| 0.06 | 6% | 70% |
| 0.08 | 8% | 60% |
| 0.10 | 10% | 50% |
| 0.12 | 12% | 40% |
| 0.14 | 14% | 30% |
| 0.16 | 16% | 20% |
| 0.18 | 18% | 10% |
| 0.20+ | 20%+ | 0% |

## Complete Example

### Input Data:
```
Period History:
- Period 1: Start Date = 2024-01-01
- Period 2: Start Date = 2024-01-29 (28 days later)
- Period 3: Start Date = 2024-02-26 (28 days later)
- Period 4: Start Date = 2024-03-25 (28 days later)
- Period 5: Start Date = 2024-04-22 (28 days later)
```

### Calculation:

1. **Actual Cycle Lengths:**
   ```
   [28, 28, 28, 28]
   ```

2. **Average Cycle Length:**
   ```
   Mean = (28 + 28 + 28 + 28) / 4 = 28 days
   ```

3. **Variance:**
   ```
   Variance = [(28-28)² + (28-28)² + (28-28)² + (28-28)²] / 4
            = [0 + 0 + 0 + 0] / 4
            = 0
   ```

4. **Standard Deviation:**
   ```
   StdDev = √0 = 0 days
   ```

5. **Coefficient of Variation:**
   ```
   CV = 0 / 28 = 0
   ```

6. **Consistency Score:**
   ```
   Score = 100 - (0 × 500) = 100%
   ```

**Result: Perfect consistency (100%)**

---

### Example 2: Moderate Variation

#### Input Data:
```
Cycle Lengths: [28, 30, 27, 29, 28, 31, 26]
```

#### Calculation:

1. **Average:**
   ```
   Mean = (28 + 30 + 27 + 29 + 28 + 31 + 26) / 7 = 28.43 days
   ```

2. **Variance:**
   ```
   Variance = Σ((x - 28.43)²) / 7 = 2.24
   ```

3. **Standard Deviation:**
   ```
   StdDev = √2.24 = 1.50 days
   ```

4. **Coefficient of Variation:**
   ```
   CV = 1.50 / 28.43 = 0.0528 (5.28%)
   ```

5. **Consistency Score:**
   ```
   Score = 100 - (0.0528 × 500) = 100 - 26.4 = 73.6%
   ```

**Result: Good consistency (74%)**

---

### Example 3: High Variation

#### Input Data:
```
Cycle Lengths: [21, 35, 25, 32, 28, 38, 22]
```

#### Calculation:

1. **Average:**
   ```
   Mean = (21 + 35 + 25 + 32 + 28 + 38 + 22) / 7 = 28.71 days
   ```

2. **Variance:**
   ```
   Variance = Σ((x - 28.71)²) / 7 = 38.24
   ```

3. **Standard Deviation:**
   ```
   StdDev = √38.24 = 6.18 days
   ```

4. **Coefficient of Variation:**
   ```
   CV = 6.18 / 28.71 = 0.215 (21.5%)
   ```

5. **Consistency Score:**
   ```
   Score = 100 - (0.215 × 500) = 100 - 107.5 = max(0, -7.5) = 0%
   ```

**Result: Inconsistent (0%)**

## Edge Cases

### Case 1: Less than 2 Periods
- **Cannot calculate cycle lengths** (need at least 2 periods)
- **Consistency Score:** Shows "N/A"
- **Message:** "Track more cycles to see patterns"

### Case 2: Only 1 Cycle Length
- **Can calculate one cycle length** but cannot measure consistency
- **Consistency Score:** 50% (neutral score)
- **Message:** "Track more cycles to see patterns"

### Case 3: Invalid Dates
- Dates that cannot be parsed are filtered out
- Only valid date pairs are used in calculations

### Case 4: Periods in the Same Month (Short Cycles)

**Scenario:** Two periods are logged with start dates in the same calendar month.

#### Example:
```
Period 1: January 5, 2024
Period 2: January 20, 2024
Cycle Length: 15 days
```

#### Handling:
- **Minimum Threshold:** Cycles less than 14 days are **filtered out** and not included in calculations
- **Reason:** Cycles shorter than 14 days are medically unrealistic and likely indicate:
  - Data entry errors (user logged the same period twice)
  - Spotting mistaken for a period
  - Incorrect date selection

#### What Happens:
1. **If cycle length < 14 days:**
   - The cycle is **excluded** from consistency score calculation
   - The period data is still stored, but not used for cycle analysis
   - Other valid cycles are still calculated normally

2. **If cycle length ≥ 14 days:**
   - The cycle is included in calculations
   - Example: A 21-day cycle in the same month would be valid

#### Example Scenarios:

**Scenario A: Two periods in same month (15 days apart)**
```
Period 1: January 5, 2024
Period 2: January 20, 2024
Cycle Length: 15 days

Result: INCLUDED (15 ≥ 14 days)
```

**Scenario B: Two periods in same month (10 days apart)**
```
Period 1: January 5, 2024
Period 2: January 15, 2024
Cycle Length: 10 days

Result: EXCLUDED (10 < 14 days) - Filtered out as unrealistic
```

**Scenario C: Multiple periods with one short cycle**
```
Period 1: January 1, 2024
Period 2: January 10, 2024 (9 days) → EXCLUDED
Period 3: February 5, 2024 (26 days from Period 1) → INCLUDED
Period 4: March 3, 2024 (26 days from Period 3) → INCLUDED

Valid Cycle Lengths: [26, 26]
Consistency Score: Calculated using only valid cycles
```

#### Why 14 Days Minimum?
- **Medical Standard:** Normal menstrual cycles range from 21-35 days
- **Data Quality:** Prevents errors from affecting consistency calculations
- **User Experience:** Users can still log periods, but unrealistic cycles don't skew results

### Case 5: Unrealistic Cycle Lengths
- Cycles < 14 days are filtered out (same-month entries, data errors)
- Cycles > 90 days are filtered out (unrealistic gaps, missing data)
- These are considered data errors or outliers

## Score Interpretation

| Score Range | Interpretation | Description |
|-------------|----------------|-------------|
| 80-100% | Very Consistent | Cycles are highly regular and predictable |
| 60-79% | Moderately Consistent | Some variation but generally regular |
| 0-59% | Inconsistent | Significant variation in cycle lengths |

## Implementation Notes

### Code Location
- File: `app/CycleInsightsScreen.jsx`
- Function: `calculateActualCycleLengths()` and `calculateInsights()`

### Key Functions

1. **`calculateActualCycleLengths()`**
   - Calculates actual cycle lengths from period history
   - Returns array of cycle lengths in days

2. **`calculateInsights()`**
   - Uses actual cycle lengths to calculate:
     - Average cycle length
     - Consistency score
     - Period length statistics

### Data Validation

The implementation includes several validation checks:
- Date validity (not NaN)
- Cycle length bounds (14-90 days) - **Minimum 14 days to filter out same-month entries**
- Period length bounds (1-14 days)
- Minimum data requirements (2+ periods for consistency)
- Same-month period filtering (cycles < 14 days are excluded)

## Mathematical Properties

### Advantages of CV-based Approach

1. **Normalized:** Works across different average cycle lengths
2. **Relative:** Measures variation relative to the mean
3. **Standardized:** Common statistical measure for consistency
4. **Intuitive:** Lower CV = higher consistency

### Limitations

1. **Requires 2+ cycles:** Cannot calculate with less than 2 periods
2. **Sensitive to outliers:** Extreme values can skew results
3. **Linear scaling:** The 500 multiplier is arbitrary but provides good range

## Future Improvements

Potential enhancements:
1. **Outlier detection:** Remove statistical outliers before calculation
2. **Weighted average:** Give more weight to recent cycles
3. **Trend analysis:** Detect if cycles are becoming more/less consistent over time
4. **Confidence intervals:** Show range of expected cycle lengths

