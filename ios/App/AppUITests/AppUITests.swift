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
        
        measure(metrics: metrics, options: options) {
            app.launch()
            
            let webView = app.webViews.firstMatch
            XCTAssertTrue(webView.waitForExistence(timeout: 10), "WebView did not appear")
        
            // 테스트 페이지로 이동
            tapButton(in: webView, withIdentifier: "start-test", timeout: 10, errorMessage: "Start button did not appear")
            
            // OpenVidu로 영상통화 시작
            tapButton(in: webView, withIdentifier: "start-video", timeout: 5, errorMessage: "Start video button did not appear")
            
            // MediaPipe의 AI model 초기화 및 첫추론
            tapButton(in: webView, withIdentifier: "load-model", timeout: 5, errorMessage: "Load model button did not appear")
            
            // MediaPipe의 AI model 이용한 실시간 동영상 추론
            tapButton(in: webView, withIdentifier: "real-time-inference", timeout: 5, errorMessage: "Real-time inference button did not appear")
            
            
            // 1. sleep()으로 통잠 재우자!
            // sleep(20)
            // => 정확히 20초가 아님. process를 20초 뒤에 깨우는 것이기에..
            
            // 2. while()로 정확한 시간동안 잠 재우자!
            // let deadline = Date().addingTimeInterval(20)
            // while Date() < deadline {
            // }
            // => 정확히 20초 동안 성능 측정 가능하지만, CPU가 너무 많이 소모됨
            // => 말하자면 쓸 데 없이 공회전 너무 자주 한다는 말씀!

           
            // 3. Thread.sleep()으로 쪽잠 재우자!
            let measurementDuration: TimeInterval = 20
            let startTime = Date()
            while Date().timeIntervalSince(startTime) < measurementDuration {
                Thread.sleep(forTimeInterval: 0.1)
            }
            // while문 만큼 정확하지는 않지만, 100ms마다 20초 지났는지 확인하니, 최대 오차가 100ms
            // 이렇게 하면 CPU 과부하도 줄이고, 다른 thread도 일할 수 있는 기회를 줌
            // 적당한 타협안임!
            
            
            // JS로 web에서 실행된 FPS 결과 확인
            checkFPSResult(in: webView)
            
            self.stopMeasuring()
        }
    }
    
    private func tapButton(in webView: XCUIElement, withIdentifier identifier: String, timeout: TimeInterval, errorMessage: String) {
        let button = webView.buttons[identifier]
        XCTAssertTrue(button.waitForExistence(timeout: timeout), errorMessage)
        button.tap()
    }
    
    private func checkFPSResult(in webView: XCUIElement) {
        let expectation = XCTNSPredicateExpectation(predicate: NSPredicate { _, _ in
            let allTexts = webView.staticTexts.allElementsBoundByIndex
            
            for (index, element) in allTexts.enumerated() {
                if element.label == "FPS-Result:", index + 1 < allTexts.count,
                   let fps = Double(allTexts[index + 1].label) {
                    print("==============Found FPS value: \(fps)================")
                    return true
                }
            }
            
            print("FPS value not found in this iteration")
            return false
        }, object: nil)
        
        let result = XCTWaiter().wait(for: [expectation], timeout: 30)
        
        if result == .completed {
            print("Successfully found and recorded FPS value")
        } else {
            XCTFail("Failed to find FPS result within timeout")
        }
    }
}
