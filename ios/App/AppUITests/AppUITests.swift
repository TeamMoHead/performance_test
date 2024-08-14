import XCTest
import WebKit


    
class CapacitorAppPerformanceTests: XCTestCase {
    var app: XCUIApplication!
  
    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
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
        
        
        // 알아서 측정해주고 평균 내주고, 로그도 찍어주는 마법의 함수!
        measure(metrics: metrics, options: options) {
            app.launch()
            
            let webView = app.webViews.firstMatch
            XCTAssertTrue(webView.waitForExistence(timeout: 10), "WebView did not appear")
        
            // test page로 이동
            let startButton = webView.buttons["start-test"]
            XCTAssertTrue(startButton.waitForExistence(timeout: 10), "Start button did not appear")
            
            startButton.tap()
            sleep(5)
            
            // OpenVidu 실행
            let startVideoBtn = webView.buttons["start-video"]
            XCTAssertTrue(startVideoBtn.waitForExistence(timeout: 5), "start-video btn did not appear")
            
            startVideoBtn.tap()
            
            // MediaPipe Model 초기화 및 첫 추론
            let loadModelBtn = webView.buttons["load-model"]
            XCTAssertTrue(loadModelBtn.waitForExistence(timeout: 5), "load-model btn did not appear")
            
            loadModelBtn.tap()
            
            // MediaPipe Model 실시간 추론
            let inferenceBtn = webView.buttons["real-time-inference"]
            XCTAssertTrue(inferenceBtn.waitForExistence(timeout: 5), "inference btn did not appear")
            
            inferenceBtn.tap()
            
            // 대기
            sleep(20)
            
            // FPS 결과 대기 및 읽기
            let expectation = XCTNSPredicateExpectation(predicate: NSPredicate(block: { _, _ -> Bool in
                print("Searching for FPS value...")
                let allTexts = webView.staticTexts.allElementsBoundByIndex
                
                for (index, element) in allTexts.enumerated() {
                    print("Checking element \(index): \(element.label)")
                    
                    if element.label == "FPS-Result:" {
                        if index + 1 < allTexts.count {
                            let nextElement = allTexts[index + 1]
                            if let fps = Double(nextElement.label) {
                                print("Found FPS value: \(fps)")
                                return true
                            }
                        }
                    }
                }
                
                print("FPS value not found in this iteration")
                return false
            }), object: nil)
            
            let result = XCTWaiter().wait(for: [expectation], timeout: 30)
            
            if result == .completed {
                print("Successfully found and recorded FPS value")
            } else {
                XCTFail("Failed to find FPS result within timeout")
            }
            
            self.stopMeasuring()
        }

        
    }
}

