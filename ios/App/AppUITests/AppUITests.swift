import XCTest
import WebKit

let THREAD_BASIC_INFO_COUNT = mach_msg_type_number_t(MemoryLayout<thread_basic_info>.size / MemoryLayout<integer_t>.size)


class CapacitorAppPerformanceTests: XCTestCase {
    var app: XCUIApplication!
    var fpsResults: [(cycle: Int, name: String, fps: [Double])] = []
    var thermalStateResults: [(cycle: Int, name: String, states: [ProcessInfo.ThermalState])] = []
    var cpuUsageResults: [(cycle: Int, name: String, usage: [Double])] = []
    var currentCycle = 0
    
    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        fpsResults = []
        thermalStateResults = []
        cpuUsageResults = []
        currentCycle = 0
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
        options.iterationCount = 5
        
        measure(metrics: metrics, options: options) {
            currentCycle += 1
            print("\n===== Starting Measurement Cycle \(currentCycle) =====")
            
            app.launch()
            
            let webView = app.webViews.firstMatch
            XCTAssertTrue(webView.waitForExistence(timeout: 10), "WebView did not appear")
        
            tapButton(in: webView, withIdentifier: "start-test", timeout: 20, errorMessage: "Start button did not appear")
            
            // OpenVidu 영상통화 테스트
            runTestPhase(name: "OpenVidu Video Call", buttonIdentifier: "start-video", duration: 20, webView: webView)
            
            // MediaPipe AI 모델 초기화 테스트
            runTestPhase(name: "MediaPipe Model Initialization", buttonIdentifier: "load-model", duration: 20, webView: webView)
            
            // MediaPipe 실시간 추론 테스트
            runTestPhase(name: "MediaPipe Real-time Inference", buttonIdentifier: "real-time-inference", duration: 20, webView: webView)
            
            tapButton(in: webView, withIdentifier: "stop-test", timeout: 10, errorMessage: "Stop button did not appear")
            self.stopMeasuring()
            sleep(2)
            
            printCycleResults()
            print("===== Completed Measurement Cycle \(currentCycle) =====\n")
        }
        
        printAllResults()
        printAverageResults()
    }
    
    private func tapButton(in webView: XCUIElement, withIdentifier identifier: String, timeout: TimeInterval, errorMessage: String) {
        let button = webView.buttons[identifier]
        XCTAssertTrue(button.waitForExistence(timeout: timeout), errorMessage)
        button.tap()
    }
    
    private func runTestPhase(name: String, buttonIdentifier: String, duration: TimeInterval, webView: XCUIElement) {
            tapButton(in: webView, withIdentifier: buttonIdentifier, timeout: 5, errorMessage: "\(name) button did not appear")
            
            var fpsData: [Double] = []
            var thermalStates: [ProcessInfo.ThermalState] = []
            var cpuUsages: [Double] = []
            
            let startTime = Date()
            while Date().timeIntervalSince(startTime) < duration {
                if Int(Date().timeIntervalSince(startTime)) % 5 == 0 {
                    checkCPUUsage(name: name, results: &cpuUsages)
                }
                
                if Int(Date().timeIntervalSince(startTime)) % 10 == 0 {
                    checkThermalState(name: name, results: &thermalStates)
                }
                
                Thread.sleep(forTimeInterval: 1)
            }
            
            checkFPSResult(in: webView, name: name, results: &fpsData)
            
            fpsResults.append((cycle: currentCycle, name: name, fps: fpsData))
            thermalStateResults.append((cycle: currentCycle, name: name, states: thermalStates))
            cpuUsageResults.append((cycle: currentCycle, name: name, usage: cpuUsages))
    }
    
    private func checkThermalState(name: String, results: inout [ProcessInfo.ThermalState]) {
        let currentState = ProcessInfo.processInfo.thermalState
        results.append(currentState)
    }
    
    private func checkCPUUsage(name: String, results: inout [Double]) {
        var totalUsage: Double = 0
        var threadCount: mach_msg_type_number_t = 0
        var threadList: thread_act_array_t?
        
        let result = task_threads(mach_task_self_, &threadList, &threadCount)
        guard result == KERN_SUCCESS else { return }
        
        for i in 0..<Int(threadCount) {
            var threadInfo = thread_basic_info()
            var threadInfoCount = mach_msg_type_number_t(THREAD_BASIC_INFO_COUNT)
            let threadInfoResult = withUnsafeMutablePointer(to: &threadInfo) {
                $0.withMemoryRebound(to: integer_t.self, capacity: Int(threadInfoCount)) {
                    thread_info(threadList![i], thread_flavor_t(THREAD_BASIC_INFO), $0, &threadInfoCount)
                }
            }
            
            if threadInfoResult == KERN_SUCCESS {
                let cpuUsage = Double(threadInfo.cpu_usage) / Double(TH_USAGE_SCALE)
                totalUsage += cpuUsage
            }
        }
        
        results.append(totalUsage)
    }
    
    private func checkFPSResult(in webView: XCUIElement, name: String, results: inout [Double]) {
            var localResults = results  // 로컬 복사본 생성
            let expectation = XCTNSPredicateExpectation(predicate: NSPredicate { _, _ in
                let allTexts = webView.staticTexts.allElementsBoundByIndex
                
                for (index, element) in allTexts.enumerated() {
                    if element.label == "FPS-Result:", index + 1 < allTexts.count,
                       let fps = Double(allTexts[index + 1].label) {
                        localResults.append(fps)  // 로컬 복사본 사용
                        return true
                    }
                }
                
                return false
            }, object: nil)
            
            let result = XCTWaiter().wait(for: [expectation], timeout: 1)
            
            if result != .completed {
                localResults.append(-1) // 실패 시 -1을 추가
            }
            
            results = localResults  // 결과를 원래 배열에 복사
    }
    
    private func printCycleResults() {
            print("Performance Results for Cycle \(currentCycle):")
            printFPSResults(for: currentCycle)
            printThermalStateResults(for: currentCycle)
            printCPUUsageResults(for: currentCycle)
        }
        
    private func printAllResults() {
        print("\n==============All Performance Results================")
        printFPSResults()
        printThermalStateResults()
        printCPUUsageResults()
        print("=================================================")
    }
    
    private func printAverageResults() {
        print("\n==============Average Performance Results================")
        printAverageFPSResults()
        printAverageThermalStateResults()
        printAverageCPUUsageResults()
        print("=================================================")
    }
    
    private func printFPSResults(for cycle: Int? = nil) {
            print("FPS Results:")
            let filteredResults = cycle != nil ? fpsResults.filter { $0.cycle == cycle! } : fpsResults
            for result in filteredResults {
                let validFPS = result.fps.filter { $0 != -1 }
                let avgFPS = validFPS.isEmpty ? 0 : validFPS.reduce(0, +) / Double(validFPS.count)
                print("Cycle \(result.cycle) - \(result.name): Average FPS: \(String(format: "%.2f", avgFPS))")
            }
        }
        
    private func printThermalStateResults(for cycle: Int? = nil) {
        print("\nThermal State Results:")
        let filteredResults = cycle != nil ? thermalStateResults.filter { $0.cycle == cycle! } : thermalStateResults
        for result in filteredResults {
            let stateCount = result.states.reduce(into: [:]) { counts, state in
                counts[state, default: 0] += 1
            }
            print("Cycle \(result.cycle) - \(result.name):")
            for (state, count) in stateCount {
                print("  \(thermalStateToString(state)): \(count) times")
            }
        }
    }
    
    private func printCPUUsageResults(for cycle: Int? = nil) {
        print("\nCPU Usage Results:")
        let filteredResults = cycle != nil ? cpuUsageResults.filter { $0.cycle == cycle! } : cpuUsageResults
        for result in filteredResults {
            let avgUsage = result.usage.reduce(0, +) / Double(result.usage.count)
            print("Cycle \(result.cycle) - \(result.name): Average CPU Usage: \(String(format: "%.2f%%", avgUsage * 100))")
        }
    }
    
    private func printAverageFPSResults() {
        print("Average FPS Results:")
        let groupedResults = Dictionary(grouping: fpsResults, by: { $0.name })
        for (name, results) in groupedResults {
            let allValidFPS = results.flatMap { $0.fps.filter { $0 != -1 } }
            let avgFPS = allValidFPS.isEmpty ? 0 : allValidFPS.reduce(0, +) / Double(allValidFPS.count)
            print("\(name): Overall Average FPS: \(String(format: "%.2f", avgFPS))")
        }
    }
    
    private func printAverageThermalStateResults() {
        print("\nAverage Thermal State Results:")
        let groupedResults = Dictionary(grouping: thermalStateResults, by: { $0.name })
        for (name, results) in groupedResults {
            let allStates = results.flatMap { $0.states }
            let stateCount = allStates.reduce(into: [:]) { counts, state in
                counts[state, default: 0] += 1
            }
            print("\(name):")
            for (state, count) in stateCount {
                let percentage = Double(count) / Double(allStates.count) * 100
                print("  \(thermalStateToString(state)): \(String(format: "%.2f%%", percentage))")
            }
        }
    }
    
    private func printAverageCPUUsageResults() {
        print("\nAverage CPU Usage Results:")
        let groupedResults = Dictionary(grouping: cpuUsageResults, by: { $0.name })
        for (name, results) in groupedResults {
            let allUsages = results.flatMap { $0.usage }
            let avgUsage = allUsages.reduce(0, +) / Double(allUsages.count)
            print("\(name): Overall Average CPU Usage: \(String(format: "%.2f%%", avgUsage * 100))")
        }
    }
    
    private func thermalStateToString(_ state: ProcessInfo.ThermalState) -> String {
        switch state {
        case .nominal: return "Nominal"
        case .fair: return "Fair"
        case .serious: return "Serious"
        case .critical: return "Critical"
        @unknown default: return "Unknown"
        }
    }
}
