import XCTest
import WebKit

class CapacitorAppPerformanceTests: XCTestCase {
    var app: XCUIApplication!
    var fpsResults: [(name: String, fps: Double)] = []
  
    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        fpsResults = []
    }
    
    func testAppPerformance() throws {
        let metrics: [XCTMetric] = [
            XCTCPUMetric(),
            XCTMemoryMetric(),
            XCTStorageMetric(),
            XCTClockMetric()
        ]
        
        let options = XCTMeasureOptions()
        options.invocationOptions = [.manuallyStop]
        options.iterationCount = 5 // metric 측정 반복 횟수
        
        measure(metrics: metrics, options: options) {
            app.launch()
            
            let webView = app.webViews.firstMatch
            XCTAssertTrue(webView.waitForExistence(timeout: 10), "WebView did not appear")
        
            // 테스트 페이지로 이동
            tapButton(in: webView, withIdentifier: "start-test", timeout: 10, errorMessage: "Start button did not appear")
            
            // OpenVidu로 영상통화 시작
            tapButton(in: webView, withIdentifier: "start-video", timeout: 5, errorMessage: "Start video button did not appear")
            
            measuringPeriod(seconds: 20)
            checkFPSResult(in: webView, name: "OpenVidu Video Call")
            
            // MediaPipe의 AI model 초기화 및 첫추론
            tapButton(in: webView, withIdentifier: "load-model", timeout: 5, errorMessage: "Load model button did not appear")
            
            measuringPeriod(seconds: 20)
            checkFPSResult(in: webView, name: "MediaPipe Model Initialization")
            
            // MediaPipe의 AI model 이용한 실시간 동영상 추론
            tapButton(in: webView, withIdentifier: "real-time-inference", timeout: 5, errorMessage: "Real-time inference button did not appear")

            measuringPeriod(seconds: 20)
            checkFPSResult(in: webView, name: "MediaPipe Real-time Inference")
            
            // 테스트 종료
            tapButton(in: webView, withIdentifier: "stop-test", timeout: 10, errorMessage: "Stop button did not appear")
            self.stopMeasuring()
            sleep(2)
            
            // 모든 FPS 결과 출력
            printFPSResults()
        }
    }
    
    private func tapButton(in webView: XCUIElement, withIdentifier identifier: String, timeout: TimeInterval, errorMessage: String) {
        let button = webView.buttons[identifier]
        XCTAssertTrue(button.waitForExistence(timeout: timeout), errorMessage)
        button.tap()
    }
    
    private func measuringPeriod(seconds: TimeInterval, checkInterval: TimeInterval = 0.1) {
        let startTime = Date()
        while Date().timeIntervalSince(startTime) < seconds {
            Thread.sleep(forTimeInterval: checkInterval)
        }
    }
    
    private func checkFPSResult(in webView: XCUIElement, name: String) {
        let expectation = XCTNSPredicateExpectation(predicate: NSPredicate { _, _ in
            let allTexts = webView.staticTexts.allElementsBoundByIndex
            
            for (index, element) in allTexts.enumerated() {
                if element.label == "FPS-Result:", index + 1 < allTexts.count,
                   let fps = Double(allTexts[index + 1].label) {
                    print("Found FPS value for \(name): \(fps)")
                    self.fpsResults.append((name: name, fps: fps))
                    return true
                }
            }
            
            print("FPS value not found for \(name)")
            return false
        }, object: nil)
        
        let result = XCTWaiter().wait(for: [expectation], timeout: 30)
        
        if result != .completed {
            print("Failed to find FPS result for \(name) within timeout")
            self.fpsResults.append((name: name, fps: -1)) // 실패 시 -1을 추가
        }
    }
    
    private func printFPSResults() {
        print("==============FPS Results================")
        for (index, result) in fpsResults.enumerated() {
            print("Measurement \(index + 1) - \(result.name): \(result.fps == -1 ? "Failed to measure" : String(format: "%.2f", result.fps))")
        }
        print("==========================================")
    }
}
