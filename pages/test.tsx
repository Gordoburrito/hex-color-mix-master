import { useState } from 'react';

export default function TestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-mix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        message: 'Test request failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testPaintColorHex = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/getPaintColorHex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paintColors: 'Titanium White\nBurnt Sienna\nIvory Black'
        }),
      });

      const data = await response.json();
      setTestResult({
        success: response.ok,
        data: data,
        message: response.ok ? 'Paint color hex test successful' : 'Paint color hex test failed'
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        message: 'Paint color hex test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Tests</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={runTest}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-4"
        >
          {isLoading ? 'Testing...' : 'Test Color Mix API'}
        </button>

        <button
          onClick={testPaintColorHex}
          disabled={isLoading}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Paint Color Hex API'}
        </button>
      </div>

      {testResult && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Test Result: 
            <span className={testResult.success ? 'text-green-600' : 'text-red-600'}>
              {testResult.success ? ' ✅ Success' : ' ❌ Failed'}
            </span>
          </h2>
          
          <p className="mb-4 text-gray-700">{testResult.message}</p>
          
          {testResult.error && (
            <div className="mb-4 p-4 bg-red-100 rounded">
              <strong>Error:</strong> {testResult.error}
            </div>
          )}
          
          {testResult.validation && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Validation Results:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li className={testResult.validation.isObject ? 'text-green-600' : 'text-red-600'}>
                  Is Object: {testResult.validation.isObject ? '✅' : '❌'}
                </li>
                <li className={testResult.validation.hasAllHexKeys ? 'text-green-600' : 'text-red-600'}>
                  Has All Hex Keys: {testResult.validation.hasAllHexKeys ? '✅' : '❌'}
                </li>
                <li className={testResult.validation.validStructure ? 'text-green-600' : 'text-red-600'}>
                  Valid Structure: {testResult.validation.validStructure ? '✅' : '❌'}
                </li>
              </ul>
              
              {testResult.validation.issues?.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-100 rounded">
                  <strong>Issues:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {testResult.validation.issues.map((issue: string, index: number) => (
                      <li key={index} className="text-red-600">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {testResult.data && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Response Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}