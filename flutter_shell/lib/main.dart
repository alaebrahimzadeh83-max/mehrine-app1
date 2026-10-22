import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MehrinehApp());
}

class MehrinehApp extends StatelessWidget {
  const MehrinehApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'مهرینه',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(colorSchemeSeed: const Color(0xFF176B55), useMaterial3: true),
        home: const MehrinehHome(),
      );
}

class MehrinehHome extends StatefulWidget {
  const MehrinehHome({super.key});
  @override
  State<MehrinehHome> createState() => _MehrinehHomeState();
}

class _MehrinehHomeState extends State<MehrinehHome> {
  late final WebViewController controller;
  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFF3F7F3))
      ..setNavigationDelegate(NavigationDelegate(
        onNavigationRequest: (request) async {
          final uri = Uri.tryParse(request.url);
          if (uri != null && (uri.scheme == 'tel' || uri.scheme == 'mailto' ||
              (uri.scheme == 'https' && !uri.host.endsWith('localhost')))) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        },
      ))
      ..loadFlutterAsset('assets/web/app.html');
  }
  @override
  Widget build(BuildContext context) => PopScope(
        canPop: false,
        onPopInvokedWithResult: (didPop, result) async {
          if (!didPop && await controller.canGoBack()) {
            await controller.goBack();
          } else if (!didPop) {
            SystemNavigator.pop();
          }
        },
        child: SafeArea(child: Scaffold(body: WebViewWidget(controller: controller))),
      );
}
