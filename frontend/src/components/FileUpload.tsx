import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, Loader2, Brain, CheckCircle, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  // Using an empty array or defining typical defaults inline instead of static file imports
  const uploadedReports: any[] = [];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PDF and image files (JPG, PNG) are allowed.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File size must be under ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      toast({ title: 'Invalid file', description: error, variant: 'destructive' });
      return;
    }
    setUploadedFile(file);
    setAnalysisComplete(false);
    setSuggestions([]);
  };

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setSuggestions([
        "Blood glucose levels are within normal range (95 mg/dL)",
        "Cholesterol levels slightly elevated - consider dietary modifications",
        "Vitamin D deficiency detected - supplementation recommended",
        "Overall cardiovascular health indicators are good",
        "Recommend follow-up in 3 months for cholesterol monitoring"
      ]);
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Upload Medical Reports
          </h1>
          <p className="text-muted-foreground">
            Upload your medical reports for AI-powered analysis and insights
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              File Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  Drag and drop your files here
                </p>
                <p className="text-muted-foreground">
                  PDF or images only (JPG, PNG). Max {MAX_SIZE_MB}MB.
                </p>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="mt-4" asChild>
                  <span className="cursor-pointer">Choose File</span>
                </Button>
              </label>
            </div>

            {/* File Preview */}
            {uploadedFile && (
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {uploadedFile.type.includes('image') ? (
                    <Image className="h-8 w-8 text-primary" />
                  ) : (
                    <FileText className="h-8 w-8 text-primary" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                  <Button 
                    onClick={simulateAIAnalysis}
                    disabled={isAnalyzing || analysisComplete}
                    className="ml-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : analysisComplete ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Uploaded reports list */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Past Reports
            </CardTitle>
            <p className="text-sm text-muted-foreground">Your previously uploaded reports (mock data).</p>
          </CardHeader>
          <CardContent>
            {uploadedReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reports uploaded yet. Upload a file above.
              </div>
            ) : (
              <div className="space-y-2">
                {uploadedReports.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      {record.type === 'PDF' ? <FileText className="h-5 w-5 text-primary" /> : <Image className="h-5 w-5 text-primary" />}
                      <div>
                        <p className="font-medium text-sm text-foreground">{record.name}</p>
                        <p className="text-xs text-muted-foreground">{record.doctor} â€¢ {record.date} â€¢ {record.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        {(suggestions.length > 0 || isAnalyzing) && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-success" />
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Analyzing your medical report...
                  </p>
                  <p className="text-muted-foreground">
                    Our AI is processing your data to provide personalized insights
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <h3 className="font-semibold text-success mb-2">Analysis Complete</h3>
                    <p className="text-sm text-foreground">
                      Based on the uploaded report, here are the key findings and recommendations:
                    </p>
                  </div>
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <p className="text-foreground">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mt-4">
                    <p className="text-sm text-foreground">
                      <strong>Disclaimer:</strong> These AI-generated insights are for informational purposes only. 
                      Please consult with your healthcare provider for professional medical advice.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
