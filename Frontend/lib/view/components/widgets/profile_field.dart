import 'package:flutter/material.dart';
import 'package:frondend/common/style.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfileFieldWidget extends StatelessWidget {
  final VoidCallback onTap;
  final TextEditingController controller;

  const ProfileFieldWidget(
      {super.key, required this.onTap, required this.controller});
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      width: double.infinity,
      decoration: BoxDecoration(
          color: Style.myColor,
          border: Border.all(),
          borderRadius: BorderRadius.circular(5)),
      child: Padding(
        padding: EdgeInsets.all(8.0),
        child: TextField(
          controller: controller,
          decoration: InputDecoration(
            border: InputBorder.none,
            hintText: 'Type here',
            labelStyle: GoogleFonts.mulish(fontSize: 12),
            suffixIcon: GestureDetector(
              onTap: onTap,
              child: Container(
                height: 5,
                width: 70,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Center(
                  child: Text(
                    'Update',
                    style:
                        GoogleFonts.mulish(color: Colors.white, fontSize: 11),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
