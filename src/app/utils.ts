export class Utils 
{
	public static isNullOrEmpty(data: any): boolean 
    {
      if (data === null || data === '' || data === 'null' || data === 'undefined' || data === undefined) { return true };
      return false;
    }
}

