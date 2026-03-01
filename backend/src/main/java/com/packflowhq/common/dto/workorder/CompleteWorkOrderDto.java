package com.packflowhq.common.dto.workorder;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CompleteWorkOrderDto {
    
    @Min(value = 0, message = "Actual quantity must be non-negative")
    private Integer actualQuantity;
    
    private String notes;
}