require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

hotwire_native_ios_source_files = "ios/vendor/hotwire-native-ios/Source/**/*.{h,m,mm,swift}"
hotwire_native_ios_resource_files = "ios/vendor/hotwire-native-ios/Source/**/*.{js}"

Pod::Spec.new do |s|
  s.name         = "RNHotwireNative"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "14.0" }
  s.source       = { :git => "https://github.com/software-mansion-labs/react-native-turbo-demo.git", :tag => "#{s.version}" }

  s.source_files = "ios/*.{h,m,mm,swift}", hotwire_native_ios_source_files
  s.resource = hotwire_native_ios_resource_files

  # This package requires the New Architecture, so it is not left to the
  # RCT_NEW_ARCH_ENABLED environment variable.
  install_modules_dependencies(s, new_arch_enabled: true)
end
