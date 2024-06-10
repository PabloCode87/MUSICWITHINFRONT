import { AbstractControl, ValidatorFn } from '@angular/forms';

export function durationFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const durationPattern = /^\d{1,2}:\d{2}$/;
    if (!durationPattern.test(control.value)) {
      return { 'invalidDurationFormat': { value: control.value } };
    }
    return null;
  };
}

export function fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      if (file) {
        const fileName: string = file.name;
        const fileExtension: string = fileName.split('.').pop()?.toLowerCase() || '';
        if (!allowedTypes.includes(fileExtension)) {
          return { 'invalidFileType': { value: file } };
        }
      }
      return null;
    };
  }
  
  
